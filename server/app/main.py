# SHARED FILE — the whole team includes their routers here.
# If a teammate already has a main.py, just add the two lines marked below
# instead of replacing the whole file.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import analysis, history  # <-- add this import for your teammates' routers too

# Creates tables from models.py if they don't exist yet.
# Once teammates add their own models, this will pick those up too.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MoodLens API")

# Vite's default dev server port — adjust if your frontend runs elsewhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(history.router)
app.include_router(analysis.router)
# app.include_router(auth.router)   <- teammate adds this once /login, /register exist


@app.get("/")
def root():
    return {"status": "MoodLens API running"}
