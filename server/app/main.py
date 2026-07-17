# SHARED FILE — the whole team includes their routers here.
# If a teammate already has a main.py, just add the two lines marked below
# instead of replacing the whole file.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routes import history  # <-- add this import for your teammates' routers too

from .routes import history, auth, analysis, dashboard
# Create FastAPI app instance before registering routers
app = FastAPI(title="MoodLens API")

# Register routers
app.include_router(history.router)
app.include_router(auth.router)
app.include_router(analysis.router)
app.include_router(dashboard.router)   # add this line

# Creates tables from models.py if they don't exist yet.
# Once teammates add their own models, this will pick those up too.
# Creates tables from models.py if they don't exist yet.
# Once teammates add their own models, this will pick those up too.
Base.metadata.create_all(bind=engine)

# Vite's default dev server port — adjust if your frontend runs elsewhere
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Note: routers already registered above


@app.get("/")
def root():
    return {"status": "MoodLens API running"}
