# GET /dashboard -- aggregates stats from the SAME analysis table History
# and Analyze both already write to. No new tables needed, this just reads
# and summarizes what's already there for the logged-in user.

import json
from collections import Counter
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Analysis, User
from ..auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    items = (
        db.query(Analysis)
        .filter(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    total = len(items)
    if total == 0:
        return {
            "total_analyses": 0,
            "positive": 0,
            "negative": 0,
            "neutral": 0,
            "sentiment_trend": [],
            "emotion_distribution": [],
            "most_common_emotion": None,
            "longest_streak": 0,
            "last_analysis_date": None,
            "average_confidence": 0,
        }

    positive = sum(1 for i in items if i.sentiment.lower() == "positive")
    negative = sum(1 for i in items if i.sentiment.lower() == "negative")
    neutral = total - positive - negative

    average_confidence = round(sum(i.confidence for i in items) / total * 100)

    # Sentiment trend: last 7 days, net positive-minus-negative count per day
    today = datetime.now(timezone.utc).date()
    trend = []
    for days_ago in range(6, -1, -1):
        day = today - timedelta(days=days_ago)
        day_items = [i for i in items if i.created_at.date() == day]
        day_positive = sum(1 for i in day_items if i.sentiment.lower() == "positive")
        day_negative = sum(1 for i in day_items if i.sentiment.lower() == "negative")
        trend.append({
            "date": day.strftime("%b %d"),
            "score": day_positive - day_negative,
            "count": len(day_items),
        })

    # Emotion distribution: split comma-separated emotion strings, count each
    emotion_counter = Counter()
    for i in items:
        if not i.emotions:
            continue
        for e in i.emotions.split(","):
            e = e.strip().lower()
            if e:
                emotion_counter[e] += 1

    emotion_distribution = []
    if emotion_counter:
        top_total = sum(emotion_counter.values())
        for emotion, count in emotion_counter.most_common(6):
            emotion_distribution.append({
                "emotion": emotion,
                "percentage": round(count / top_total * 100),
            })

    most_common_emotion = emotion_counter.most_common(1)[0][0] if emotion_counter else None

    # Longest streak: consecutive calendar days with at least one analysis
    dates = sorted({i.created_at.date() for i in items}, reverse=True)
    longest_streak = 1
    current_streak = 1
    for i in range(1, len(dates)):
        if (dates[i - 1] - dates[i]).days == 1:
            current_streak += 1
            longest_streak = max(longest_streak, current_streak)
        else:
            current_streak = 1

    return {
        "total_analyses": total,
        "positive": positive,
        "negative": negative,
        "neutral": neutral,
        "sentiment_trend": trend,
        "emotion_distribution": emotion_distribution,
        "most_common_emotion": most_common_emotion,
        "longest_streak": longest_streak,
        "last_analysis_date": items[0].created_at.isoformat(),
        "average_confidence": average_confidence,
    }