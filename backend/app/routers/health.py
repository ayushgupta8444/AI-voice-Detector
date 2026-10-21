from fastapi import APIRouter
from app.config import settings
from app.schemas.schemas import HealthResponse
from app.services.transcription import get_whisper_model

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
def get_health_status():
    """Returns system status, active capabilities, and configured models."""
    whisper_available = bool(get_whisper_model())
    
    return HealthResponse(
        status="operational",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
        capabilities={
            "speech_to_text": {
                "provider": settings.TRANSCRIPTION_PROVIDER,
                "model_size": settings.WHISPER_MODEL_SIZE,
                "supported_languages": settings.SUPPORTED_LANGUAGES,
                "device": settings.WHISPER_DEVICE,
                "is_active": whisper_available
            },
            "scam_detection": {
                "engine": "VoiceShield Deterministic Rule Engine",
                "version": "1.0.0",
                "indicator_categories": [
                    "credentials", "remote_access", "impersonation", 
                    "financial", "urgency", "threats", 
                    "emotional_manipulation", "payment_methods"
                ]
            },
            "audio_authenticity": {
                "enabled": settings.ENABLE_AUDIO_AUTHENTICITY,
                "model_name": settings.AUTHENTICITY_MODEL_NAME,
                "status": "operational" if settings.ENABLE_AUDIO_AUTHENTICITY else "disabled"
            },
            "privacy": {
                "audio_retention_default": settings.AUDIO_RETENTION_DEFAULT,
                "storage_mode": "temporary_ephemeral"
            },
            "helplines": {
                "india_cybercrime_portal": settings.INDIAN_CYBERCRIME_PORTAL_URL,
                "india_cybercrime_helpline": settings.INDIAN_CYBERCRIME_HELPLINE,
                "chakshu_portal": settings.CHAKSHU_PORTAL_URL
            }
        }
    )
