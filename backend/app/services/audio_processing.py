import os
import shutil
import tempfile
import uuid
from typing import Tuple, Optional
import soundfile as sf
from fastapi import HTTPException, status
from app.config import settings

def save_temp_audio(content: bytes, extension: str) -> str:
    """Saves raw audio content to a temporary file on disk."""
    temp_dir = tempfile.gettempdir()
    unique_filename = f"voiceshield_{uuid.uuid4().hex}.{extension}"
    temp_path = os.path.join(temp_dir, unique_filename)
    with open(temp_path, "wb") as f:
        f.write(content)
    return temp_path

def get_audio_metadata(file_path: str) -> Tuple[float, int, int]:
    """
    Extracts duration in seconds, sample rate, and channel count.
    Uses soundfile or PyAV for broad format support.
    """
    try:
        with sf.SoundFile(file_path) as audio:
            duration = float(len(audio)) / float(audio.samplerate)
            return duration, audio.samplerate, audio.channels
    except Exception:
        # Fallback to PyAV for WebM / M4A / MP3
        try:
            import av
            container = av.open(file_path)
            stream = next((s for s in container.streams if s.type == 'audio'), None)
            if stream is None:
                raise ValueError("No audio stream found in container")
            duration = float(container.duration or 0) / float(av.time_base)
            sample_rate = stream.rate or 16000
            channels = stream.channels or 1
            return duration, sample_rate, channels
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to read audio metadata. File may be corrupted or in an unsupported encoding: {str(e)}"
            )

def validate_audio_duration(duration_seconds: float):
    """Enforces maximum allowed audio duration."""
    if duration_seconds > settings.MAX_AUDIO_DURATION_SECONDS:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio duration of {duration_seconds:.1f}s exceeds maximum limit of {settings.MAX_AUDIO_DURATION_SECONDS}s."
        )

def persist_audio_if_enabled(temp_path: str, user_retention_enabled: bool) -> Optional[str]:
    """
    If retention is explicitly enabled by the user, moves audio to secure storage.
    Otherwise, leaves it to be deleted (privacy by design).
    """
    if not user_retention_enabled:
        return None

    try:
        os.makedirs(settings.AUDIO_STORAGE_PATH, exist_ok=True)
        ext = temp_path.rsplit(".", 1)[-1]
        secure_filename = f"{uuid.uuid4().hex}.{ext}"
        destination = os.path.join(settings.AUDIO_STORAGE_PATH, secure_filename)
        shutil.copy2(temp_path, destination)
        return destination
    except Exception:
        return None

def cleanup_file(path: Optional[str]):
    """Safely removes temporary audio file from disk."""
    if path and os.path.exists(path):
        try:
            os.remove(path)
        except OSError:
            pass
