from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, UserUtteranceReverted, ConversationPaused
import json


class ActionNameFetch(Action):

    def name(self) -> Text:
        return "action_set_name"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        name = "John"
        return [SlotSet("name", name)]


class ActionDefaultFallback(Action):
    def name(self) -> Text:
        return "action_default_fallback"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:

        dispatcher.utter_message(text="I didn't understand that. Can you rephrase?")

        return [UserUtteranceReverted()]


class ActionEndSession(Action):
    def name(self) -> Text:
        return "action_end_session"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any],
    ) -> List[Dict[Text, Any]]:
        conversation_data = []
        actions_to_track = [
            "utter_height",
            "utter_weight",
            "utter_temperature",
            "utter_blood_pressure",
            "utter_glucose_level",
            "utter_blood_group",
            "utter_symptoms",
            "utter_symptoms_change",
            "utter_medications",
            "utter_allergies",
            "utter_medical_history",
            "utter_family_history",
            "utter_smoking",
            "utter_alcohol_consumption",
            "utter_daily_diet",
            "utter_daily_habits",
            "utter_sleep",
            "utter_stress",
            "utter_education_living",
            "utter_additional_info",
        ]
        intents_to_track = [
            "provide_height",
            "provide_weight",
            "provide_temperature",
            "provide_blood_pressure",
            "provide_glucose_level",
            "provide_blood_group",
            "provide_symptoms",
            "provide_symptoms_change",
            "provide_medications",
            "provide_allergies",
            "provide_medical_history",
            "provide_family_history",
            "provide_smoking",
            "provide_alcohol_consumption",
            "provide_daily_diet",
            "provide_daily_habits",
            "provide_sleep",
            "provide_stress",
            "provide_education_living",
            "provide_additional_info",
            "deny",
            "affirm",
        ]
        flag = True
        question = ""
        answer = ""
        # Derive intent from action
        for event in tracker.events:
            if (
                event.get("event") == "bot"
                and event.get("metadata").get("utter_action") in actions_to_track
                and flag == True
            ):
                if event.get("text"):
                    question = event.get("text")
                    flag = False

            elif (
                event.get("event") == "user"
                and event.get("parse_data").get("intent").get("name")
                in intents_to_track
                and flag == False
            ):
                answer = event.get("text", None)
                if answer:
                    conversation_data.append({question: answer})
                    flag = True

        print(conversation_data)
        return [ConversationPaused()]
