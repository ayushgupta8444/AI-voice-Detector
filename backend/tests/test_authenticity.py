import io
import math
import struct
import wave
import pytest
from app.services.audio_authenticity import analyze_audio_authenticity
from app.services.audio_processing import save_temp_audio, cleanup_file

def synthesize_sine_wave(freq_hz: float = 220.0, duration: float = 1.0, sr: int = 16000) -> bytes:
    """Synthesizes PCM WAV sine wave tone."""
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        num_samples = int(duration * sr)
        samples = []
        for i in range(num_samples):
            val = int(16000 * math.sin(2 * math.pi * freq_hz * i / sr))
            samples.append(struct.pack('<h', val))
        wf.writeframes(b''.join(samples))
    return buf.getvalue()

def test_authenticity_returns_metrics_on_valid_audio():
    wav_bytes = synthesize_sine_wave(freq_hz=440.0, duration=1.0)
    temp_path = save_temp_audio(wav_bytes, "wav")
    try:
        result = analyze_audio_authenticity(temp_path)
        assert result is not None
        assert "model_name" in result
        assert "model_version" in result
        assert "estimated_risk_score" in result
        assert 0.0 <= result["estimated_risk_score"] <= 100.0
        assert "limitations" in result
        assert "acoustic_metrics" in result
        metrics = result["acoustic_metrics"]
        assert "sample_rate_hz" in metrics
        assert "spectral_rolloff_hz" in metrics
    finally:
        cleanup_file(temp_path)

def test_authenticity_handles_none_or_missing_file():
    assert analyze_audio_authenticity(None) is None
    assert analyze_audio_authenticity("nonexistent_audio_path_xyz.wav") is None
