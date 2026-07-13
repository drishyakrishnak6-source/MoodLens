"""
seed_test_user.py -- run this ONCE to unblock local testing.

Creates a real test user in the database (since /register doesn't exist
yet) and prints a JWT properly signed with this server's actual JWT_SECRET
-- unlike the old hardcoded DEMO_TOKEN, which was never signed with the
real secret and could never pass auth.py's verification.

Run from inside the `server` folder:
    python seed_test_user.py
"""

from app.database import SessionLocal, Base, engine
from app.models import User
from app.auth import create_access_token

Base.metadata.create_all(bind=engine)

db = SessionLocal()

test_user = db.query(User).filter(User.email == "test@moodlens.dev").first()
if not test_user:
    test_user = User(
        username="testuser",
        email="test@moodlens.dev",
        password="placeholder-not-a-real-hash",  # fine for local dev only
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    print(f"Created test user with id={test_user.id}")
else:
    print(f"Test user already exists with id={test_user.id}")

token = create_access_token({"sub": str(test_user.id)})
print("\nCopy this token:\n")
print(token)
print("\nThen paste it into your browser console (F12 -> Console tab) and run:")
print(f'localStorage.setItem("token", "{token}")')

db.close()