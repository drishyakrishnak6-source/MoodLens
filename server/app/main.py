# SHARED FILE — the whole team includes their routers here.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import analysis, history, auth, dashboard

# Creates tables from models.py if they don't exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MoodLens API")

# Vite's default dev server port — adjust if your frontend runs elsewhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(history.router)
app.include_router(analysis.router)
app.include_router(auth.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"status": "MoodLens API running"}