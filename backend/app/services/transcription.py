import os
from typing import Dict, Any, List, Optional
from app.config import settings

# Lazy-loaded faster-whisper model
_whisper_model = None

def get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        try:
            from faster_whisper import WhisperModel
            # Load tiny model with int8 quantization for ultra-fast local inference
            _whisper_model = WhisperModel(
                settings.WHISPER_MODEL_SIZE,
                device=settings.WHISPER_DEVICE,
                compute_type=settings.WHISPER_COMPUTE_TYPE,
                cpu_threads=4
            )
        except Exception as e:
            print(f"[TranscriptionService] Warning: Could not initialize faster-whisper: {e}")
            _whisper_model = False
    return _whisper_model

def transcribe_audio(file_path: str, requested_language: Optional[str] = None) -> Dict[str, Any]:
    """
    Transcribes audio file to text with timestamps and language detection.
    Supports English ('en') and Hindi ('hi').
    Returns {
        "transcript": str,
        "language": str,
        "language_probability": float,
        "segments": List[Dict],
        "model_name": str
    }
    """
    model = get_whisper_model()
    
    # 1. Try faster-whisper
    if model:
        try:
            # Language option
            lang_param = requested_language if requested_language in ["en", "hi"] else None
            
            segments, info = model.transcribe(
                file_path,
                beam_size=3,
                language=lang_param,
                vad_filter=True, # voice activity detection filter to strip silence
                vad_parameters=dict(min_silence_duration_ms=500)
            )

            segment_list = []
            transcript_parts = []

            for seg in segments:
                text = seg.text.strip()
                if text:
                    segment_list.append({
                        "id": seg.id,
                        "start": round(seg.start, 2),
                        "end": round(seg.end, 2),
                        "text": text
                    })
                    transcript_parts.append(text)

            full_transcript = " ".join(transcript_parts).strip()
            
            if not full_transcript:
                return {
                    "transcript": "",
                    "language": info.language or requested_language or "en",
                    "language_probability": round(info.language_probability, 3) if info else 1.0,
                    "segments": [],
                    "model_name": f"faster-whisper-{settings.WHISPER_MODEL_SIZE}"
                }

            return {
                "transcript": full_transcript,
                "language": info.language if info else (requested_language or "en"),
                "language_probability": round(info.language_probability, 3) if info else 1.0,
                "segments": segment_list,
                "model_name": f"faster-whisper-{settings.WHISPER_MODEL_SIZE}"
            }
        except Exception as e:
            print(f"[TranscriptionService] faster-whisper error: {e}, attempting fallback...")

    # 2. Fallback to SpeechRecognition Google Speech API
    try:
        import speech_recognition as sr
        r = sr.Recognizer()
        
        # If WAV or convertible
        with sr.AudioFile(file_path) as source:
            audio_data = r.record(source)

        lang_code = "hi-IN" if requested_language == "hi" else "en-US"
        recognized_text = r.recognize_google(audio_data, language=lang_code)

        return {
            "transcript": recognized_text,
            "language": requested_language or ("hi" if lang_code == "hi-IN" else "en"),
            "language_probability": 0.90,
            "segments": [{"id": 0, "start": 0.0, "end": 0.0, "text": recognized_text}],
            "model_name": "google-speech-recognition"
        }
    except Exception as e:
        # Never fabricate transcript!
        raise RuntimeError(f"Speech transcription failed: {str(e)}. Please check audio clarity or try another audio format.")
