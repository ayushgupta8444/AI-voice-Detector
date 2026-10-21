# VoiceShield AI — INS Expo Live Demonstration Script
**Information and Network Security (INS) Expo 2026**

## 1. Setup & Pre-Flight Checklist

Before judges or evaluators arrive at the booth:

1. **Start Backend**:
   ```bash
   cd backend
   python run.py
   # Confirms: Uvicorn running on http://127.0.0.1:8000
   ```
2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   # Confirms: Vite dev server running on http://localhost:5173
   ```
3. Open browser at `http://localhost:5173`.
4. Ensure microphone permission is enabled in browser settings if demonstrating live microphone voice recording.

---

## 2. The 30-Second Elevator Pitch

> *"Good morning, judges! Today we are presenting **VoiceShield AI**, an explainable cybersecurity threat analyzer designed to combat the explosive surge in voice-based social engineering scams—such as Digital Arrests, OTP harvesting, and AI voice cloning.*
>
> *Unlike opaque neural networks that output a black-box probability, VoiceShield AI deploys a **dual-layer architecture**: a transparent speech-to-text rule engine that pinpoints exact spoken threat excerpts, alongside an independent acoustic forensic analyzer that measures physical vocoder anomalies and pitch jitter. Let us demonstrate how it works in real time."*

---

## 3. Live Demonstration Walkthrough

### Act 1: The "Digital Arrest" Scam (Critical Risk)

1. Navigate to the **Workspace** page (`/workspace`).
2. Point out the **Expo Demo Presets** banner at the top of the workspace.
3. Click on **"Digital Arrest / CBI Scam"**.
   - *Explanation to Judges*: *"Notice how this scenario mirrors real-world extortion: a caller impersonating a CBI Inspector claiming an arrest warrant, ordering the victim to stay in their room, and demanding fund transfer to a 'safe account'."*
4. Click **"Execute VoiceShield Forensics Analysis"**.
5. The progress pipeline visualizes:
   - Header check ➔ Whisper STT ➔ Indicator Extraction ➔ Forensic Scoring.
6. **Result Page Display**:
   - Point out the **Critical Risk Badge (Score: 100.0/100)**.
   - Show the **Spoken Transcript with Highlighted Evidence**:
     - Red highlight: *Authority Impersonation (CBI / Digital Arrest)*.
     - Orange highlight: *Enforced Secrecy & Isolation ("Do not disconnect this call, stay inside your room")*.
     - Red highlight: *Unfamiliar Safe Account Transfer*.
   - Click on any highlight to reveal the contextual threat explanation.
   - Show the **Recommended Safe Actions** tailored specifically to extortion defense.

---

### Act 2: Live Browser Microphone Recording

1. Click **"New Audio Analysis"** or return to `/workspace`.
2. Select the **"Record via Microphone"** tab.
3. Click the cyan **Record** button (browser mic permission prompt).
4. Speak into the microphone:
   > *"Sir, I am calling from State Bank fraud department. Your account will be frozen within 15 minutes unless you complete your KYC. Please share the 6-digit OTP code sent to your phone right now."*
5. Click the red **Stop** button.
6. Play back the recorded audio through the built-in HTML5 player to verify clear audio.
7. Click **"Execute VoiceShield Forensics Analysis"**.
8. Show how `faster-whisper` transcribes the voice live, flags the **OTP harvesting** and **urgency threats**, and scores it as **Critical Risk**.

---

### Act 3: Benign Control Call (Zero False Positives)

1. Return to the workspace and click **"Benign Customer Service Call"** in the presets.
   - Dialogue: *"Hi there! This is Priya from FreshGrocers calling regarding your order placed this morning..."*
2. Run the analysis.
3. **Result**:
   - Points out the green **Low Risk Badge (0.0/100)**.
   - Emphasize to judges: *"A major pitfall in cybersecurity AI is false alarms. VoiceShield AI requires compound threat actions before triggering alarms, ensuring legitimate business and family calls are never falsely flagged."*

---

### Act 4: Exporting Incident PDF & Official Helplines

1. On any scam report page, click **"Download Incident PDF"**.
2. Open the downloaded PDF:
   - Highlight the official report header: *VoiceShield AI Cybersecurity Incident Report*.
   - Point out the metadata table, evidence excerpts, acoustic forensics summary, and safe action checklists.
3. Scroll down to the **Official Cybercrime Response Resources** component:
   - Show the verified integration with the **National Cyber Crime Helpline (1930)**, **cybercrime.gov.in**, and the DoT **Chakshu portal**.

---

### Act 5: Cybersecurity Dashboard & History Telemetry

1. Click **"Dashboard"** in the top navigation.
2. Show the real-time **Recharts** visualizations:
   - **Risk Category Donut Chart** (distribution of analyzed calls).
   - **Commonly Detected Scam Vectors Bar Chart** (frequency of OTP vs Digital Arrest vs Remote Access).
   - **Recent Incident Stream Table**.
3. Emphasize that all dashboard metrics are calculated from real database records (never fabricated static values).

---

## 4. Prepared Answers for Tough Judge Questions

**Q1: How do you prevent attackers from modifying phrasing to bypass detection?**
> *"Our rule engine matches semantic intent and phonetic variants across English, Hindi, and Hinglish. Furthermore, because scammers rely on specific structural outcomes—namely urgency, credential theft, remote access, or fund transfer—they cannot completely eliminate these operational steps without failing their scam."*

**Q2: Can your system detect deepfakes with 100% certainty?**
> *"No, and as a cybersecurity best practice, we explicitly disclose this. High-compression cellular codecs (such as AMR at 12.2kbps) degrade audio harmonics. Therefore, our acoustic forensics engine presents an experimental synthetic anomaly estimate based on physical vocoder boundaries and pitch jitter, clearly separated from the transcript scam assessment."*

**Q3: How is user privacy protected?**
> *"By default, VoiceShield AI enforces a Zero-Retention architecture. Temporary audio files are scrubbed from disk immediately after feature extraction. User accounts are isolated using PostgreSQL Row Level Security (RLS) policies."*
