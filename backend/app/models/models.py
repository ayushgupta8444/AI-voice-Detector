import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    display_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    audio_retention_enabled = Column(Boolean, default=False, nullable=False)
    audio_retention_duration = Column(Integer, default=7, nullable=False) # days
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="settings")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=True, index=True)
    original_filename = Column(String(255), nullable=False)
    audio_duration_seconds = Column(Float, nullable=True)
    detected_language = Column(String(10), default="en")
    transcript = Column(Text, nullable=False)
    transcript_source = Column(String(50), default="whisper_model") # whisper_model, user_edited, manual_input
    scam_risk_score = Column(Float, nullable=False) # 0.0 - 100.0
    scam_risk_category = Column(String(30), nullable=False) # Low Risk, Medium Risk, High Risk, Critical Risk
    detected_indicators = Column(JSON, default=list)
    evidence_excerpts = Column(JSON, default=list)
    recommended_actions = Column(JSON, default=list)
    transcription_model = Column(String(100), default="faster-whisper-tiny")
    detection_method_version = Column(String(100), default="VoiceShield-Rules-v1.0")
    processing_status = Column(String(30), default="completed")
    retained_audio_path = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, index=True)

    user = relationship("User", back_populates="analyses")
    authenticity_result = relationship("AudioAuthenticityResult", back_populates="analysis", uselist=False, cascade="all, delete-orphan")

class AudioAuthenticityResult(Base):
    __tablename__ = "audio_authenticity_results"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    model_name = Column(String(100), nullable=False)
    model_version = Column(String(50), nullable=False)
    estimated_risk_score = Column(Float, nullable=True) # 0.0 - 100.0
    result_summary = Column(Text, nullable=False)
    limitations = Column(Text, nullable=False)
    acoustic_metrics = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    analysis = relationship("Analysis", back_populates="authenticity_result")
