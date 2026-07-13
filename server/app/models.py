# SHARED FILE — used by the whole team.
# Matches "4. Database Design" in the architecture doc.
# If teammates already created User/Analysis models, merge instead of overwriting.

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # store a bcrypt hash, never plain text
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    analyses = relationship(
        "Analysis", back_populates="owner", cascade="all, delete-orphan"
    )


class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    sentiment = Column(String, nullable=False)  # "Positive" | "Negative" | "Neutral"
    confidence = Column(Float, nullable=False)
    emotions = Column(Text, nullable=True)  # JSON string, e.g. '{"joy":0.8}'
    entities = Column(Text, nullable=True)  # JSON string, e.g. '["Paris","John"]'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="analyses")
