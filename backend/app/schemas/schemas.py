from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- Auth Schemas -----------------
class UserRegister(BaseModel):
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    password: str = Field(..., min_length=6, max_length=128)
    display_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    display_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ----------------- Analysis Schemas -----------------
class IndicatorDetail(BaseModel):
    id: str
    name: str
    category: str # urgency, credentials, financial, impersonation, threats, remote_access, payment_methods, emotional_manipulation
    severity: str # critical, high, medium, low
    weight: float
    matched_phrase: str
    excerpt: str
    explanation: str
    char_start: int
    char_end: int

class AuthenticityResponse(BaseModel):
    id: Optional[str] = None
    model_name: str
    model_version: str
    estimated_risk_score: Optional[float] = None # 0.0 - 100.0
    result_summary: str
    limitations: str
    acoustic_metrics: Dict[str, Any] = {}
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    original_filename: str
    audio_duration_seconds: Optional[float] = None
    detected_language: str
    transcript: str
    transcript_source: str
    scam_risk_score: float
    scam_risk_category: str
    detected_indicators: List[IndicatorDetail]
    evidence_excerpts: List[str]
    recommended_actions: List[str]
    transcription_model: str
    detection_method_version: str
    processing_status: str
    retained_audio_path: Optional[str] = None
    authenticity: Optional[AuthenticityResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TranscriptAnalyzeRequest(BaseModel):
    transcript: str = Field(..., min_length=5, max_length=50000)
    language: Optional[str] = "en"
    original_filename: Optional[str] = "manual_transcript.txt"

class AnalysesListResponse(BaseModel):
    items: List[AnalysisResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

class DashboardStatsResponse(BaseModel):
    total_analyses: int
    category_counts: Dict[str, int]
    top_indicators: List[Dict[str, Any]]
    recent_analyses: List[AnalysisResponse]
    success_count: int
    failure_count: int
    timeline: List[Dict[str, Any]]

# ----------------- Settings Schemas -----------------
class UserSettingsResponse(BaseModel):
    user_id: str
    audio_retention_enabled: bool
    audio_retention_duration: int
    updated_at: datetime

    class Config:
        from_attributes = True

class UserSettingsUpdate(BaseModel):
    audio_retention_enabled: Optional[bool] = None
    audio_retention_duration: Optional[int] = Field(None, ge=1, le=90)

# ----------------- Health Schemas -----------------
class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    environment: str
    capabilities: Dict[str, Any]
