# VoiceShield AI — System Architecture Document
**Information and Network Security (INS) Expo 2026**

## 1. Executive Summary

VoiceShield AI is a full-stack cybersecurity platform engineered to detect voice-based social engineering, impersonation attacks, and audio manipulation artifacts. Rather than relying on opaque black-box deep learning scores, VoiceShield AI deploys a **dual-layer explainable pipeline**:

1. **Spoken Scam Language Engine**: Offline-capable Speech-to-Text transcription coupled with a deterministic cybersecurity grammar engine that identifies, tags, and highlights exact attack excerpts.
2. **Acoustic Signal Forensics**: A distinct, independent digital signal processing analyzer examining physical vocoder boundaries, spectral rolloff, Wiener entropy, and pitch micro-jitter.

---

## 2. Component Architecture

```
[ Client Browser (React + TypeScript + Tailwind) ]
       │
       ├── User Authentication (JWT / Supabase Auth)
       ├── Microphone Recording (MediaRecorder API) / File Upload
       ├── HTML5 Audio Player & Visualizer
       ├── Interactive Highlighted Transcript Viewer
       └── Recharts Incident Telemetry Dashboard
       │
       ▼ (HTTPS / REST API)
[ FastAPI Backend Gateway (Python 3.11) ]
       │
       ├── Request Validation & Media Header Magic-Byte Sanitizer
       │
       ├──► [ Audio Processing Service ]
       │         └── Duration Checks, Bitrate & Samplerate Extraction (Soundfile / PyAV)
       │
       ├──► [ Multilingual Transcription Service ]
       │         └── faster-whisper (Int8 CPU quantized) / SpeechRecognition Fallback
       │
       ├──► [ Scam Indicator Detection Engine ]
       │         └── 12 RegEx & Semantic Indicator Grammars with Character Offset Tracking
       │
       ├──► [ Explainable Risk Scorer ]
       │         └── Weighted Base Scores + Compounding Attack Multipliers (0 - 100)
       │
       ├──► [ Acoustic Forensics Engine (Signal Analysis) ]
       │         └── Spectral Rolloff, Flatness Variance, Pitch (F0) Jitter Micro-Tremor
       │
       ├──► [ Incident PDF Report Generator (fpdf2) ]
       │
       └──► [ Database & Row Level Security (SQLAlchemy / PostgreSQL / Supabase) ]
                 ├── profiles
                 ├── analyses
                 ├── audio_authenticity_results
                 └── user_settings
```

---

## 3. Data Flow

### 3.1 Audio Analysis Workflow

1. **Ingress & Sanitization**:
   - File size enforced (`MAX_AUDIO_SIZE_MB = 25MB`).
   - Filename sanitized against path traversal and shell injection.
   - Header magic-bytes validated (RIFF for WAV, ID3/Sync for MP3, EBML for WebM, ftyp for M4A).
   - Audio duration verified (`MAX_AUDIO_DURATION_SECONDS = 600s`).

2. **Transcription Pipeline**:
   - Speech converted to text via `faster-whisper-tiny` with VAD (Voice Activity Detection) filter.
   - Preserves timestamps per segment.
   - Supports English (`en`) and Hindi (`hi`).

3. **Threat Pattern Extraction**:
   - Spoken transcript matched against calibrated rules across 8 threat dimensions.
   - Extracts exact `char_start` and `char_end` coordinates for visual evidence highlighting.

4. **Compounding Scoring Engine**:
   - Base indicator weights summed.
   - Compounding multipliers applied when complementary attack tactics co-occur (e.g., *Impersonation + Urgency + OTP*).
   - Mapped to standard severity tiers: *Low Risk* (0-29.9), *Medium Risk* (30-59.9), *High Risk* (60-84.9), *Critical Risk* (85-100).

5. **Acoustic Signal Forensics (Experimental)**:
   - Evaluates audio signals for neural synthesis signatures (vocoder cutoff at 8kHz, unnaturally smoothed pitch jitter < 0.8%, mathematical silence ratios).
   - Kept strictly separate from transcript scam risk.

6. **Storage & Retention Scrubbing**:
   - If audio retention is disabled (default): raw audio files are immediately purged from `/tmp`.
   - If audio retention is enabled: stored with a cryptographically random UUID token in private storage.

---

## 4. Database Schema & RLS

VoiceShield AI implements **Supabase Row Level Security (RLS)** policies:

- `profiles`: Linked to `auth.users` with cascading deletion.
- `analyses`: User-isolated with `auth.uid() = user_id`.
- `audio_authenticity_results`: Foreign key to `analyses(id)` with cascading cleanup.
- `user_settings`: User privacy preferences (`audio_retention_enabled`, `audio_retention_duration`).
