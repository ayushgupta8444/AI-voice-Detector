import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "VoiceShield AI"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = "sqlite:///./voiceshield.db"
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Security & JWT
    JWT_SECRET_KEY: str = "voiceshield-cybersecurity-expo-secret-key-2026-secure"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours

    # Audio Limits & Upload Controls
    MAX_AUDIO_SIZE_MB: int = 25
    MAX_AUDIO_DURATION_SECONDS: int = 600 # 10 minutes
    ALLOWED_AUDIO_EXTENSIONS: List[str] = ["wav", "mp3", "m4a", "webm", "ogg", "flac", "aac"]
    ALLOWED_MIME_TYPES: List[str] = [
        "audio/wav", "audio/x-wav", "audio/wave",
        "audio/mpeg", "audio/mp3",
        "audio/mp4", "audio/m4a", "audio/x-m4a",
        "audio/webm",
        "audio/ogg", "audio/vorbis",
        "audio/flac", "audio/x-flac"
    ]

    # Transcription & Speech Recognition
    TRANSCRIPTION_PROVIDER: str = "faster-whisper" # 'faster-whisper', 'google_speech', 'auto'
    WHISPER_MODEL_SIZE: str = "tiny" # 'tiny', 'base', 'small'
    WHISPER_DEVICE: str = "cpu"
    WHISPER_COMPUTE_TYPE: str = "int8"
    SUPPORTED_LANGUAGES: List[str] = ["en", "hi"]

    # Voice Authenticity Analysis
    ENABLE_AUDIO_AUTHENTICITY: bool = True
    AUTHENTICITY_MODEL_NAME: str = "VoiceShield-Acoustic-Forensics-v1.0"

    # Privacy & Storage
    AUDIO_RETENTION_DEFAULT: bool = False
    AUDIO_STORAGE_PATH: str = "./storage/audio"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]

    # Official Helplines (India)
    INDIAN_CYBERCRIME_PORTAL_URL: str = "https://cybercrime.gov.in"
    INDIAN_CYBERCRIME_HELPLINE: str = "1930"
    CHAKSHU_PORTAL_URL: str = "https://sancharsaathi.gov.in/sfc/"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure storage directory exists
os.makedirs(settings.AUDIO_STORAGE_PATH, exist_ok=True)
