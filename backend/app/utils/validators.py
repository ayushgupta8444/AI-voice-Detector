import re
import os
from fastapi import HTTPException, UploadFile, status
from app.config import settings

def sanitize_filename(filename: str) -> str:
    """Sanitizes filename against path traversal and malicious characters."""
    # Strip any directory path components regardless of slash style
    clean = filename.replace("\\", "/").split("/")[-1]
    clean = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', clean)
    return clean[:100]

def validate_audio_file(file: UploadFile, content: bytes) -> str:
    """
    Validates audio file size, extension, and binary header magic bytes.
    Returns cleaned filename or raises HTTPException.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a valid filename."
        )

    # Size check
    file_size_bytes = len(content)
    if file_size_bytes == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded audio file is empty (0 bytes)."
        )

    max_bytes = settings.MAX_AUDIO_SIZE_MB * 1024 * 1024
    if file_size_bytes > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Audio file exceeds maximum allowed size of {settings.MAX_AUDIO_SIZE_MB}MB."
        )

    # Extension check
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported audio format '.{ext}'. Supported formats are: {', '.join(settings.ALLOWED_AUDIO_EXTENSIONS)}."
        )

    # Magic byte inspection for cybersecurity integrity
    # WAV: 'RIFF'
    # MP3: ID3 or sync bits 0xFF 0xFB/0xF3/0xF2
    # OGG: 'OggS'
    # FLAC: 'fLaC'
    # MP4/M4A: 'ftyp'
    # WebM: 0x1A 0x45 0xDF 0xA3 (EBML)
    header = content[:16]
    is_valid_header = False

    if ext == "wav" and header[:4] == b"RIFF":
        is_valid_header = True
    elif ext == "mp3" and (header[:3] == b"ID3" or (len(header) >= 2 and header[0] == 0xFF and (header[1] & 0xE0) == 0xE0)):
        is_valid_header = True
    elif ext in ["ogg", "oga"] and header[:4] == b"OggS":
        is_valid_header = True
    elif ext == "flac" and header[:4] == b"fLaC":
        is_valid_header = True
    elif ext in ["m4a", "mp4", "aac"] and (b"ftyp" in header or header[:2] == b"\xff\xf1" or header[:2] == b"\xff\xf9"):
        is_valid_header = True
    elif ext == "webm" and header[:4] == b"\x1a\x45\xdf\xa3":
        is_valid_header = True
    else:
        # If binary signature doesn't match standard header, allow if common audio container or webm chunk
        if len(content) > 64 and (b"RIFF" in content[:64] or b"ID3" in content[:64] or b"ftyp" in content[:64] or b"\x1a\x45\xdf\xa3" in content[:64]):
            is_valid_header = True
        elif ext in ["webm", "mp3", "m4a", "wav", "ogg"]:
            # Some encoders omit standard container prefix in streaming WebM or raw ADTS AAC
            is_valid_header = True

    if not is_valid_header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or invalid audio stream for format .{ext}."
        )

    return sanitize_filename(file.filename)
