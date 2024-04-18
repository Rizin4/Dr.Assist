import './ChatInt.css';
import  { useEffect, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import io from 'socket.io-client';
import { SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';
import { TiMicrophone } from "react-icons/ti";
import { TiMicrophoneOutline } from "react-icons/ti";

function Basic() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setbotTyping] = useState(false);
    const [socket, setSocket] = useState(null);

    const name = "george"; //to be removed ;for setting name  temporarily

    const generateSessionId = () => {
        const sessionId = uuidv4();
        sessionStorage.setItem('sessionId', sessionId);
    };

    const generateJWT = async () => { //to be removed ;for generating jwt token temporarily
        const payload = {
            "user": {
                "username": name,
                "role": "user"
            },
            "session_id": sessionStorage.getItem('sessionId')
        };
        const secretKey = process.env.REACT_APP_JWT_SECRET_KEY;
        const secretKeyutf8 = new TextEncoder().encode(secretKey);
        const jwt = await new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secretKeyutf8);
        localStorage.setItem('jwt', jwt);
    }


    useEffect(() => {
        console.log("called");
        const objDiv = document.getElementById('messageArea');
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [chat])

    useEffect(() => {
        console.log("useEffect called");
        generateJWT(); //to be removed ;for generating jwt token temporarily
        const jwt = localStorage.getItem('jwt');
        console.log("token: ", jwt);

        const newSocket = io(process.env.REACT_APP_SOCKET_SERVER_URL, {
            "auth": {
                "token": jwt
            }
        });

        newSocket.on('connect', () => {
            generateSessionId();
            const sessionId = sessionStorage.getItem('sessionId');
            console.log("connected : ", sessionId);
            newSocket.emit('session_request', { session_id: sessionId });
            setSocket(newSocket);
            console.log("connect socket1: ", newSocket);

        });
        newSocket.on('session_confirm', (session_id) => {
            console.log("session_confirm: ", session_id);
        });
        newSocket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        newSocket.on('bot_uttered', (response) => {
            console.log("response: ", response);
            const response_temp = { sender: "bot", recipient_id: name, msg: response.text };

            setbotTyping(false);
            setChat(chat => [...chat, response_temp]);
        });

        newSocket.on('connect_error', (error) => {
            console.log('Connection failed:', error);
        });

        return () => {
            newSocket.off('connect');
            newSocket.off('disconnect');
            newSocket.off('bot_uttered');
            newSocket.off('session_confirm');
            newSocket.off('connect_error');
            newSocket.close()
        };
    }, []);



    const handleSubmit = (evt) => {
        evt.preventDefault();
        console.log(chat);
        if (socket == null) {
            console.error("socket is null");
            return;
        }
        console.log("socket2: ", socket);
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage };

        if (inputMessage !== "") {

            setChat(chat => [...chat, request_temp]);
            setbotTyping(true);
            setInputMessage('');
            console.log("inputMessage: ", inputMessage);
            const sessionId = sessionStorage.getItem('sessionId');
            socket.emit('user_uttered', { message: inputMessage, session_id: sessionId, sender: name }, () => {
                console.log("user_uttered invoked");
            });
            // rasaAPI(name, inputMessage);
        }
        else {
            window.alert("Please enter valid message");
        }
    }

    const [isMicOn, setIsMicOn] = useState(false); // Initial state: mic off

    const toggleMic = () => {
        setIsMicOn(!isMicOn); // Toggle the mic state
    };


    // const rasaAPI = async function handleClick(name, msg) {

    //     //chatData.push({sender : "user", sender_id : name, msg : msg});


    //     await fetch('http://localhost:5005/webhooks/rest/webhook', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'charset': 'UTF-8',
    //         },
    //         credentials: "same-origin",
    //         body: JSON.stringify({ "sender": name, "message": msg }),
    //     })
    //         .then(response => response.json())
    //         .then((response) => {
    //             if (response) {
    //                 const temp = response[0];
    //                 const recipient_id = temp["recipient_id"];
    //                 const recipient_msg = temp["text"];
    //                 const response_temp = { sender: "bot", recipient_id: recipient_id, msg: recipient_msg };

    //                 setbotTyping(false);
    //                 setChat(chat => [...chat, response_temp]);
    //                 // scrollBottom();

    //             }
    //         })
    // }



    const stylecard = {
        maxWidth: '35rem',
        border: '1px solid black',
        paddingLeft: '0px',
        paddingRight: '0px',
        borderRadius: '30px',
        boxShadow: '0 16px 20px 0 rgba(0,0,0,0.4)'

    }
    const styleHeader = {
        height: '4.5rem',
        borderBottom: '1px solid black',
        borderRadius: '30px 30px 0px 0px',
        backgroundColor: '#2B3035',

    }
    const styleFooter = {
        //maxWidth : '32rem',
        borderTop: '1px solid black',
        borderRadius: '0px 0px 30px 30px',
        backgroundColor: '#2B3035',


    }
    const styleBody = {
        paddingTop: '10px',
        height: '28rem',
        overflowY: 'a',
        overflowX: 'hidden',

    }

    return (
        <div>
            {/* <button onClick={()=>rasaAPI("shreyas","hi")}>Try this</button> */}


            <div className="container">
                <div className="row justify-content-center">

                    <div className="card" style={stylecard}>
                        <div className="cardHeader text-white" style={styleHeader}>
                            <h1 style={{ marginBottom: '0px' }}>AI Assistant</h1>
                            {botTyping ? <h6>Bot Typing....</h6> : null}



                        </div>
                        <div className="cardBody" id="messageArea" style={styleBody}>

                            <div className="row msgarea">
                                {chat.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ?
                                            (

                                                <div className='msgalignstart'>
                                                    <BiBot className="botIcon" /><h5 className="botmsg">{user.msg}</h5>
                                                </div>

                                            )

                                            : (
                                                <div className='msgalignend'>
                                                    <h5 className="usermsg">{user.msg}</h5><BiUser className="userIcon" />
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}

                            </div>

                        </div>
                        <div className="cardFooter text-white" style={styleFooter}>
                            <div className="row">
                                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                                    <div className="col-9" style={{ paddingRight: '0px' }}>
                                        <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} type="text" className="msginp"></input>
                                    </div>
                                    <div className="col-2 cola">
                                        {isMicOn ?
                                            <button type="submit" className="circleBtn" onClick={toggleMic}><TiMicrophone className="sendBtn" /></button>
                                            : <button type="submit" className="circleBtn" onClick={toggleMic}><TiMicrophoneOutline className="sendBtn" /></button>}

                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn" ><IoMdSend className="sendBtn" /></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Basic;