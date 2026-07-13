# Run this once from server/ (with venv activated) to populate test data:
#   python seed_data.py
#
# Safe to run multiple times — it reuses the same test user (id=1) created
# earlier when you generated your test token, and just adds more rows.

from datetime import datetime, timedelta, timezone

from app.database import SessionLocal, Base, engine
from app.models import User, Analysis

# Ensures tables exist even if uvicorn hasn't been started yet
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Reuse the test user created earlier; create it if it's missing
user = db.query(User).filter(User.email == "test@test.com").first()
if not user:
    user = User(username="test", email="test@test.com", password="hashed")
    db.add(user)
    db.commit()
    db.refresh(user)

sample_data = [
    {"text": "Today was such a good day. My friends and I met up after ages and we ended up laughing so hard over old memories that my stomach hurt. I forgot how much I needed that.", "sentiment": "Positive", "confidence": 0.94, "emotions": "joy, excitement", "days_ago": 1},
    {"text": "I don't really know why, but I've felt off since this morning. Nothing bad happened, I just feel a little heavy, like I'm carrying something I can't name.", "sentiment": "Negative", "confidence": 0.81, "emotions": "sadness", "days_ago": 1},
    {"text": "Nothing much happened today. Went through the usual motions, work, chores, dinner. Not a bad day, just a quiet one.", "sentiment": "Neutral", "confidence": 0.67, "emotions": "calm", "days_ago": 2},
    {"text": "Finally got through my whole to-do list today, and it feels amazing. I've been putting some of these tasks off for weeks, so crossing them out one by one was oddly satisfying.", "sentiment": "Positive", "confidence": 0.91, "emotions": "pride, motivation", "days_ago": 2},
    {"text": "I keep thinking about the exam next week and my chest gets tight every time. I know I've prepared, but the anxiety doesn't seem to care about that.", "sentiment": "Negative", "confidence": 0.88, "emotions": "anxiety, stress", "days_ago": 3},
    {"text": "Took a long walk through Central Park with Sarah this evening. The weather was perfect and we didn't talk about anything important, just easy conversation. Exactly what I needed.", "sentiment": "Positive", "confidence": 0.85, "emotions": "contentment", "days_ago": 3},
    {"text": "Had dinner with the group tonight and it was honestly one of the best nights I've had in a while. Good food, better company, and we stayed at the table talking long after we finished eating.", "sentiment": "Positive", "confidence": 0.93, "emotions": "joy, gratitude", "days_ago": 4},
    {"text": "Watched a movie with everyone tonight, nothing special, just cozy and familiar. There's something comforting about doing ordinary things with people you love.", "sentiment": "Positive", "confidence": 0.89, "emotions": "contentment", "days_ago": 4},
    {"text": "Work has been relentless this week and today it finally caught up with me. I feel like I'm drowning in deadlines and I don't know which fire to put out first.", "sentiment": "Negative", "confidence": 0.9, "emotions": "stress, overwhelm", "days_ago": 5},
    {"text": "I've just been irritable all day and I can't pinpoint why. Small things that normally wouldn't bother me have been setting me off, and I feel a bit guilty about it.", "sentiment": "Negative", "confidence": 0.79, "emotions": "irritability", "days_ago": 5},
    {"text": "Got the results back today and they weren't what I was hoping for. I thought I did better than this, and it's hard not to feel like I let myself down.", "sentiment": "Negative", "confidence": 0.83, "emotions": "disappointment", "days_ago": 6},
    {"text": "For the first time in a while, I feel like things are actually moving in the right direction. It's a small shift, but I can feel the difference in how I'm thinking about the future.", "sentiment": "Positive", "confidence": 0.87, "emotions": "hope, optimism", "days_ago": 6},
    {"text": "A pretty mixed bag of a day, honestly. Some good moments, some frustrating ones. Nothing that really stands out either way.", "sentiment": "Neutral", "confidence": 0.62, "emotions": "mixed", "days_ago": 7},
    {"text": "Exhausted, but in a good way. It was a long one, but I got through everything I needed to and there's a quiet satisfaction in that, even if all I want right now is my bed.", "sentiment": "Positive", "confidence": 0.8, "emotions": "relief, fatigue", "days_ago": 7},
    {"text": "Nothing big happened today, but I noticed myself appreciating the small things more, my coffee this morning, a nice message from a friend, the walk home in the sun. I want to remember more days like this.", "sentiment": "Positive", "confidence": 0.92, "emotions": "gratitude", "days_ago": 8},
    {"text": "Got into it with my roommate again over chores. It's the same argument every time and I'm tired of having it. I don't think either of us handled it well tonight.", "sentiment": "Negative", "confidence": 0.77, "emotions": "frustration", "days_ago": 8},
    {"text": "Started a new book today and I'm already hooked. It's been a long time since I've been this excited to pick something up again in the evenings.", "sentiment": "Positive", "confidence": 0.86, "emotions": "curiosity, joy", "days_ago": 9},
    {"text": "Rained pretty much all day, so I stayed in and let myself actually rest for once. I've been running on empty for a while, so this felt necessary rather than lazy.", "sentiment": "Neutral", "confidence": 0.6, "emotions": "calm", "days_ago": 9},
    {"text": "Missed my bus this morning and walked into an important meeting fifteen minutes late. I was flustered the whole time and could barely focus after that.", "sentiment": "Negative", "confidence": 0.84, "emotions": "frustration, anxiety", "days_ago": 10},
    {"text": "We celebrated a friend's birthday tonight and it turned into one of those nights that just flows, good music, good people, no one wanting to leave. I'm still smiling thinking about it.", "sentiment": "Positive", "confidence": 0.95, "emotions": "joy, excitement", "days_ago": 10},
]

for item in sample_data:
    analysis = Analysis(
        user_id=user.id,
        text=item["text"],
        sentiment=item["sentiment"],
        confidence=item["confidence"],
        emotions=item["emotions"],
        entities="",
        created_at=datetime.now(timezone.utc) - timedelta(days=item["days_ago"]),
    )
    db.add(analysis)

db.commit()

user_id = user.id  # capture before closing the session
db.close()

print(f"Seeded {len(sample_data)} analysis rows for user_id={user_id}")