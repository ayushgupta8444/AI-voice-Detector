# VoiceShield AI — Voice Scam & Audio Forensics Risk Analyzer
**A Full-Stack Cybersecurity Application for the Information and Network Security (INS) Expo**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Whisper STT](https://img.shields.io/badge/Whisper-faster--whisper-blue.svg)](https://github.com/SYSTRAN/faster-whisper)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Tests](https://img.shields.io/badge/Pytest-20%2F20%20Passed-emerald.svg)](backend/tests)

---

## 1. Project Overview

**VoiceShield AI** is a modern cybersecurity application built for the Information and Network Security (INS) Expo. It provides an automated, explainable analysis workspace to evaluate suspicious voice recordings and telephone dialogues for:

- **Social Engineering & Extortion**: Digital Arrest threats, authority impersonation (CBI, Police, Customs), bank KYC panics, and fake family emergencies.
- **Credential & Fund Theft**: OTP harvesting, UPI traps, banking PIN requests, and "safe account" wire fraud.
- **Device Compromise**: Coerced installation of remote-access tools (AnyDesk, TeamViewer, RustDesk).
- **Acoustic Manipulation Forensics**: An experimental signal analysis module evaluating physical vocoder boundaries, spectral rolloff, Wiener entropy, and pitch micro-jitter.

> **Important Defensive Principle**: VoiceShield AI never claims that a voice is definitely genuine or cloned based on an unreliable black-box prediction. It provides transparent, evidence-backed indicator breakdowns with word-for-word transcript highlighting and safe action guidance.

---

## 2. Core Capabilities

- **Audio Ingress & Microphone Recording**:
  - Supports WAV, MP3, M4A, WebM, OGG, and FLAC files.
  - In-browser microphone recording with explicit user consent and real-time audio visualization.
  - Binary magic-byte header inspection and file size enforcement (25MB cap).
  - Built-in HTML5 audio player with seek bar and volume controls.
- **Multilingual Speech Recognition**:
  - Integrated `faster-whisper` STT model with Int8 CPU quantization.
  - Automatic language detection and support for English and Hindi.
  - Editable transcript panel preserving original transcribed text.
- **Explainable Scam Scoring**:
  - 12 rule grammars with contextual offsets (`char_start`, `char_end`).
  - Compounding risk multipliers when complementary attack tactics co-occur.
  - Calibrated severity tiers: *Low Risk* (0-29.9), *Medium Risk* (30-59.9), *High Risk* (60-84.9), *Critical Risk* (85-100).
- **Experimental Acoustic Forensics**:
  - Spectral rolloff analysis detecting low-bitrate vocoder cutoffs (e.g., at 8kHz).
  - Pitch (F0) autocorrelation micro-jitter measuring vocal cord tremor (detecting robotic smoothness < 0.8%).
  - Kept strictly separate from the transcript-based scam risk score.
- **Incident PDF Export & National Helplines**:
  - Instant generation of forensic incident reports in PDF format via `fpdf2`.
  - Direct integration and verified links to the **National Cyber Crime Helpline (1930)**, **cybercrime.gov.in**, and the DoT **Chakshu portal**.
- **Privacy by Design**:
  - Zero audio retention by default: temporary audio buffers are scrubbed immediately from server storage.
  - Optional user-configured retention policy with automated purge duration.

---

## 3. Technology Stack

- **Frontend**:
  - React 18 with TypeScript
  - Vite build tool
  - Tailwind CSS with custom dark cyber theme
  - React Router v6
  - Recharts for interactive telemetry visualizations
  - Lucide icons
- **Backend**:
  - Python 3.11 with FastAPI
  - Pydantic v2 schemas and request validation
  - SQLAlchemy 2.0 ORM
  - `faster-whisper` (CTranslate2) & `SpeechRecognition`
  - `soundfile`, `scipy`, `numpy`, `av` (PyAV) for signal forensics
  - `fpdf2` for incident PDF generation
- **Database & Authentication**:
  - PostgreSQL / Supabase with Row Level Security (RLS) policies
  - Seamless zero-configuration SQLite fallback for offline expo evaluation
  - Secure JWT authentication with bcrypt password hashing
- **Testing**:
  - Pytest test suite with 20 unit and integration tests

---

## 4. Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint
│   │   ├── config.py                # Environment settings & thresholds
│   │   ├── database.py              # SQLAlchemy engine & session manager
│   │   ├── models/                  # Database models (User, Analysis, Authenticity)
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── routers/                 # API endpoints (health, auth, analyze, analyses, settings)
│   │   ├── services/                # Audio processing, transcription, scam detector, forensics
│   │   └── utils/                   # JWT security & media header validators
│   ├── data/
│   │   ├── evaluation_dataset.json  # 14 labelled test cases (scam & benign)
│   │   └── sample_audio/            # Sample WAV audio files for instant testing
│   ├── tests/                       # Complete Pytest test suite (20 tests)
│   ├── requirements.txt             # Python backend dependencies
│   └── run.py                       # Uvicorn local runner script
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, Footer, AudioPlayer, AudioRecorder, TranscriptViewer
│   │   ├── pages/                   # Landing, Login, Register, Workspace, Result, Dashboard, History
│   │   ├── context/                 # AuthContext session provider
│   │   ├── services/api.ts          # Strongly-typed API client
│   │   └── types/index.ts           # TypeScript interfaces
│   ├── index.html                   # HTML entrypoint with cyber branding
│   ├── tailwind.config.js           # Cyber theme configuration
│   └── package.json                 # Node.js dependencies
├── supabase/
│   └── schema.sql                   # Supabase PostgreSQL schema with RLS policies
├── docs/
│   ├── ARCHITECTURE.md              # Detailed system architecture document
│   ├── THREAT_MODEL.md              # Threat model & STRIDE security analysis
│   ├── EVALUATION_REPORT.md         # Benchmark dataset metrics & confusion matrix
│   └── EXPO_DEMO_SCRIPT.md          # Step-by-step live presentation guide for judges
├── .env.example                     # Environment variables template
├── pytest.ini                       # Pytest configuration
└── README.md                        # Project documentation
```

---

## 5. Quickstart & Local Setup

### 5.1 Prerequisites

- Python 3.10+ (tested on Python 3.11)
- Node.js v18+ and npm
- Git

### 5.2 Backend Setup

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI backend:
   ```bash
   python run.py
   ```
   The backend will start at `http://127.0.0.1:8000`. You can inspect the interactive OpenAPI Swagger docs at `http://127.0.0.1:8000/api/docs`.

### 5.3 Frontend Setup

1. Open a second terminal:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 6. Running the Test Suite

Execute all 20 backend unit, security, and benchmark evaluation tests:

```bash
python -m pytest backend/tests -v
```

### Benchmark Evaluation Results

```
================ EVALUATION DATASET RESULTS ================
Total Test Cases: 14 (8 Scam Scenarios, 6 Benign Scenarios)
Confusion Matrix: TP=8, FP=0, TN=6, FN=0
Precision: 1.0000 (100%)
Recall:    1.0000 (100%)
F1-Score:  1.0000
============================================================
20 passed in 3.15s
```

---

## 7. API Reference Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Discover system capabilities and configured models | No |
| `POST`| `/api/auth/register` | Register a new security operator account | No |
| `POST`| `/api/auth/login` | Authenticate and obtain Bearer JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |
| `POST`| `/api/analyze` | Upload audio for transcription, scam detection & forensics | Optional |
| `POST`| `/api/analyze-transcript` | Text-only transcript analysis | Optional |
| `GET` | `/api/analyses` | Paginated user analysis history with search & filter | Yes |
| `GET` | `/api/analyses/{id}` | Retrieve individual incident analysis report | Yes |
| `DELETE`| `/api/analyses/{id}` | Delete individual analysis and scrub retained audio | Yes |
| `DELETE`| `/api/analyses` | Purge entire analysis history | Yes |
| `GET` | `/api/analyses/{id}/pdf` | Download official incident report PDF | Yes |
| `GET` | `/api/analyses/stats/dashboard` | Telemetry analytics for dashboard charts | Yes |
| `GET` | `/api/settings` | Read audio retention and privacy preferences | Yes |
| `PATCH`| `/api/settings` | Update retention settings | Yes |

---

## 8. Supabase Cloud Setup (Optional)

To connect VoiceShield AI to a remote Supabase cloud project:

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run the contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Copy your project connection string and set `DATABASE_URL` in your `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   ```

---

## 9. Academic & Expo Credits

Developed for the **Information and Network Security (INS) Expo 2026**.
Dedicated to advancing explainable AI in defensive voice fraud prevention and citizen cybersecurity awareness.
