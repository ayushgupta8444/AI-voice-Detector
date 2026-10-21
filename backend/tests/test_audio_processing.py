import io
import wave
import pytest
from fastapi import HTTPException, UploadFile
from app.utils.validators import validate_audio_file, sanitize_filename
from app.services.audio_processing import get_audio_metadata, save_temp_audio, cleanup_file

def create_synthetic_wav_bytes(duration_seconds: float = 1.0, sample_rate: int = 16000) -> bytes:
    """Helper to synthesize valid PCM WAV audio in memory."""
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2) # 16-bit
        wf.setframerate(sample_rate)
        # Write silence/sine samples
        num_frames = int(duration_seconds * sample_rate)
        wf.writeframes(b'\x00\x00' * num_frames)
    return buf.getvalue()

def test_sanitize_filename():
    assert sanitize_filename("../../../etc/passwd.wav") == "passwd.wav"
    assert sanitize_filename("test; rm -rf audio.wav") == "test__rm_-rf_audio.wav"

def test_validate_audio_file_empty():
    mock_file = UploadFile(filename="empty.wav", file=io.BytesIO(b""))
    with pytest.raises(HTTPException) as exc:
        validate_audio_file(mock_file, b"")
    assert exc.value.status_code == 400
    assert "empty" in exc.value.detail.lower()

def test_validate_audio_file_unsupported_ext():
    mock_file = UploadFile(filename="malicious.exe", file=io.BytesIO(b"binary"))
    with pytest.raises(HTTPException) as exc:
        validate_audio_file(mock_file, b"binary")
    assert exc.value.status_code == 400
    assert "unsupported" in exc.value.detail.lower()

def test_validate_valid_wav_bytes():
    wav_bytes = create_synthetic_wav_bytes(1.0)
    mock_file = UploadFile(filename="sample.wav", file=io.BytesIO(wav_bytes))
    clean_name = validate_audio_file(mock_file, wav_bytes)
    assert clean_name == "sample.wav"

def test_get_audio_metadata_on_valid_wav():
    wav_bytes = create_synthetic_wav_bytes(2.0, sample_rate=16000)
    temp_path = save_temp_audio(wav_bytes, "wav")
    try:
        duration, sr, channels = get_audio_metadata(temp_path)
        assert round(duration, 1) == 2.0
        assert sr == 16000
        assert channels == 1
    finally:
        cleanup_file(temp_path)
