import logging
import uuid
import json
from typing import Any, Awaitable, Callable, Dict, Optional, Text

import rasa.core.channels.channel
from rasa.core.channels.channel import UserMessage
import rasa.shared.utils.io
from sanic import Blueprint, response, Sanic
from sanic.request import Request
from sanic.response import HTTPResponse
from socketio import AsyncServer

logger = logging.getLogger(__name__)

from rasa.core.channels.socketio import SocketIOInput, SocketIOOutput, SocketBlueprint


class CustomSocketIOInput(SocketIOInput):

    @classmethod
    def name(cls) -> Text:
        return "socketio"

    def __init__(
        self,
        user_message_evt: Text = "user_uttered",
        bot_message_evt: Text = "bot_uttered",
        namespace: Optional[Text] = None,
        session_persistence: bool = False,
        socketio_path: Optional[Text] = "/socket.io",
        jwt_key: Optional[Text] = None,
        jwt_method: Optional[Text] = "HS256",
        metadata_key: Optional[Text] = "metadata",
    ):
        super().__init__(
            user_message_evt,
            bot_message_evt,
            namespace,
            session_persistence,
            socketio_path,
            jwt_key,
            jwt_method,
            metadata_key,
        )

    def blueprint(
        self, on_new_message: Callable[[UserMessage], Awaitable[Any]]
    ) -> Blueprint:
        sio = AsyncServer(async_mode="sanic", cors_allowed_origins=[])
        socketio_webhook = SocketBlueprint(
            sio, self.socketio_path, "socketio_webhook", __name__
        )

        # make sio object static to use in get_output_channel
        self.sio = sio

        @socketio_webhook.route("/", methods=["GET"])
        async def health(_: Request) -> HTTPResponse:
            return response.json({"status": "ok"})

        @sio.on("connect", namespace=self.namespace)
        async def connect(sid: Text, environ: Dict, auth: Optional[Dict]) -> bool:
            if self.jwt_key:
                jwt_payload = None
                if auth and auth.get("token"):
                    jwt_payload = rasa.core.channels.channel.decode_bearer_token(
                        auth.get("token"), self.jwt_key, self.jwt_algorithm
                    )
                    logger.debug("jwt payload from frontend" + str(jwt_payload))

                if jwt_payload:
                    session_id = jwt_payload.get("session_id")
                    await on_new_message(
                        UserMessage(
                            text="",
                            sender_id=session_id,
                            input_channel=self.name(),
                            metadata=jwt_payload,
                        )
                    )
                    logger.debug(f"User {sid} connected to socketIO endpoint.")
                    return True
                else:
                    return False
            else:
                logger.debug(f"User {sid} connected to socketIO endpoint.")
                return True

        @sio.on("disconnect", namespace=self.namespace)
        async def disconnect(sid: Text) -> None:
            logger.debug(f"User {sid} disconnected from socketIO endpoint.")

        @sio.on("session_request", namespace=self.namespace)
        async def session_request(sid: Text, data: Optional[Dict]) -> None:
            if data is None:
                data = {}
            if "session_id" not in data or data["session_id"] is None:
                data["session_id"] = uuid.uuid4().hex
            if self.session_persistence:
                await sio.enter_room(sid, data["session_id"])
            await sio.emit("session_confirm", data["session_id"], room=sid)
            logger.debug(f"User {sid} connected to socketIO endpoint.")

        @sio.on(self.user_message_evt, namespace=self.namespace)
        async def handle_message(sid: Text, data: Dict) -> None:
            output_channel = SocketIOOutput(sio, self.bot_message_evt)

            if self.session_persistence:
                if not data.get("session_id"):
                    rasa.shared.utils.io.raise_warning(
                        "A message without a valid session_id "
                        "was received. This message will be "
                        "ignored. Make sure to set a proper "
                        "session id using the "
                        "`session_request` socketIO event."
                    )
                    return
                sender_id = data["session_id"]
            else:
                sender_id = sid

            metadata = data.get(self.metadata_key, {})
            if isinstance(metadata, Text):
                metadata = json.loads(metadata)
            message = UserMessage(
                data.get("message", ""),
                output_channel,
                sender_id,
                input_channel=self.name(),
                metadata=metadata,
            )
            await on_new_message(message)

        return socketio_webhook
