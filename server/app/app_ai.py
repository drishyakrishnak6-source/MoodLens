"""
ai.py -- Hugging Face model integration.

Uses the huggingface_hub InferenceClient (the current recommended way to
call hosted models -- Hugging Face's older raw-REST "Inference API" URLs
have been superseded by "Inference Providers", and InferenceClient handles
that routing for you automatically).

Three models, matching the architecture doc's "three Hugging Face AI models":
  - Sentiment : distilbert-base-uncased-finetuned-sst-2-english
  - Emotion   : j-hartmann/emotion-english-distilroberta-base   <- this is
                the one assigned to the Emotion Model role specifically
  - NER       : dslim/bert-base-NER

Setup required (one-time):
  1. pip install huggingface_hub  (already in requirements.txt)
  2. Get a token at https://huggingface.co/settings/tokens
     -- use a "fine-grained" token with "Make calls to Inference Providers" checked
  3. Put it in server/.env as HF_TOKEN=hf_xxxxxxxxxxxx

If a specific model ever isn't available through serverless inference
(this can happen for less-popular models), swap SENTIMENT_MODEL /
EMOTION_MODEL / NER_MODEL below for another model on huggingface.co that
supports the same task -- filter by task on the Models page and look for
the "Inference Providers" section on the model card to confirm availability.
"""

import os
import json
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
if not HF_TOKEN:
    raise RuntimeError(
        "HF_TOKEN is not set. Add HF_TOKEN=hf_xxxxx to server/.env "
        "(get one at https://huggingface.co/settings/tokens) and restart uvicorn."
    )
client = InferenceClient(token=HF_TOKEN)

SENTIMENT_MODEL = "cardiffnlp/twitter-roberta-base-sentiment-latest"
EMOTION_MODEL = "j-hartmann/emotion-english-distilroberta-base"
NER_MODEL = "dslim/bert-base-NER"


def _field(item, key):
    """huggingface_hub returns either dicts or small typed objects depending
    on version -- this reads a field either way so the code doesn't break
    across huggingface_hub versions."""
    if isinstance(item, dict):
        return item[key]
    return getattr(item, key)


def analyze_sentiment(text: str) -> dict:
    """Returns {"label": "Positive" | "Negative", "score": float}."""
    try:
        results = client.text_classification(text, model=SENTIMENT_MODEL)
        top = max(results, key=lambda r: _field(r, "score"))
        return {
            "label": _field(top, "label").capitalize(),
            "score": round(float(_field(top, "score")), 4),
        }
    except Exception as e:
        raise RuntimeError(f"Sentiment model call failed: {e}") from e


def analyze_emotion(text: str) -> dict:
    """
    This is the Emotion Model integration.

    j-hartmann/emotion-english-distilroberta-base labels are:
    anger, disgust, fear, joy, neutral, sadness, surprise.

    Returns {"top_emotion": str, "confidence": float, "all_emotions": [...]}
    -- all_emotions contains EVERY label the model scored (all 7), sorted
    strongest-first, not just the top one.
    """
    try:
        results = client.text_classification(text, model=EMOTION_MODEL)
        ranked = sorted(results, key=lambda r: _field(r, "score"), reverse=True)
        return {
            "top_emotion": _field(ranked[0], "label"),
            "confidence": round(float(_field(ranked[0], "score")), 4),
            "all_emotions": [
                {"label": _field(r, "label"), "score": round(float(_field(r, "score")), 4)}
                for r in ranked
            ],
        }
    except Exception as e:
        raise RuntimeError(f"Emotion model call failed: {e}") from e


def extract_entities(text: str) -> list:
    """
    Returns a list of {"text": str, "type": "PER"|"ORG"|"LOC"|"MISC", "score": float}.
    aggregation_strategy="simple" merges wordpiece tokens back into whole
    words/phrases (e.g. "New" + "York" -> "New York") instead of returning
    fragmented sub-tokens.
    """
    try:
        results = client.token_classification(text, model=NER_MODEL, aggregation_strategy="simple")
        return [
            {
                "text": _field(r, "word"),
                "type": _field(r, "entity_group"),
                "score": round(float(_field(r, "score")), 4),
            }
            for r in results
        ]
    except Exception as e:
        raise RuntimeError(f"NER model call failed: {e}") from e


def analyze(text: str) -> dict:
    """
    Perform sentiment, emotion, and NER analysis for the given text.

    NOTE on "emotions": AnalyzeResponse.emotions is typed as `str` in
    schemas.py, so rather than changing that shared file (which History
    and other routes might also touch), this packs the FULL emotion
    breakdown -- all 7 labels with their scores, not just the strongest
    one -- into a JSON string. It's still a valid `str` as far as the
    schema/database are concerned, just one that happens to contain
    structured data. The frontend does JSON.parse(result.emotions) to get
    the full list back out.
    """
    sentiment = analyze_sentiment(text)
    emotion = analyze_emotion(text)
    entities = extract_entities(text)

    return {
        "sentiment": sentiment["label"],
        "confidence": sentiment["score"],
        "emotions": json.dumps(emotion["all_emotions"]),
        "entities": ", ".join([entity["text"] for entity in entities]) if entities else "",
    }