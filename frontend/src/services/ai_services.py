# Calls Hugging Face's free Inference API for sentiment + emotion detection.
# Needs HUGGINGFACE_API_TOKEN in .env -- get a free one at
# huggingface.co/settings/tokens (no payment info required for this tier).

import os
import requests
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN")
HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"}

SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"
EMOTION_MODEL = "j-hartmann/emotion-english-distilroberta-base"

HF_URL = "https://api-inference.huggingface.co/models/{}"


def _query(model, text):
    response = requests.post(
        HF_URL.format(model), headers=HEADERS, json={"inputs": text}, timeout=30
    )
    response.raise_for_status()
    return response.json()


def analyze(text: str) -> dict:
    """
    Returns a dict matching the existing Analysis table's columns exactly:
    sentiment ("Positive"/"Negative"/"Neutral"), confidence (0-1 float),
    emotions (comma-separated string), entities (empty string for now).
    """
    # Sentiment
    sent_result = _query(SENTIMENT_MODEL, text)
    sent_scores = sent_result[0]
    best_sentiment = max(sent_scores, key=lambda x: x["score"])
    label_map = {"positive": "Positive", "negative": "Negative", "neutral": "Neutral"}
    sentiment = label_map.get(best_sentiment["label"].lower(), "Neutral")
    confidence = round(best_sentiment["score"], 2)

    # Emotions
    emo_result = _query(EMOTION_MODEL, text)
    emo_scores = emo_result[0]
    top_emotions = sorted(emo_scores, key=lambda x: x["score"], reverse=True)[:2]
    emotions = ", ".join([e["label"] for e in top_emotions if e["score"] > 0.1])

    return {
        "sentiment": sentiment,
        "confidence": confidence,
        "emotions": emotions,
        "entities": "",
    }