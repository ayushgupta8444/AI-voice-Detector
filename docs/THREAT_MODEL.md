# VoiceShield AI — Threat Model & Security Considerations
**Information and Network Security (INS) Expo 2026**

## 1. Scope & Objective

VoiceShield AI analyzes untrusted audio recordings and transcripts to detect spoken scams, social engineering coercion, and acoustic manipulation. Because the application handles user-submitted audio and cybersecurity incident data, it must be hardened against both application-layer attacks and external social engineering threats.

---

## 2. Threat Actor Profiles

| Threat Actor | Motivation | Capabilities |
| :--- | :--- | :--- |
| **Voice Scam Syndicates** | Financial extortion, credential theft, unauthorized bank transfers | Automated robocalling, voice cloning, scripted psychological coercion |
| **Malicious Uploaders** | Denial of Service (DoS), Remote Code Execution (RCE), Server Exhaustion | Specially crafted audio files, zip bombs, command injection payloads |
| **Unauthorized Insiders** | Data theft, surveillance, privacy violations | Snooping on user incident reports, intercepting unauthenticated API calls |

---

## 3. Threat Vectors & Attack Surface

### 3.1 Social Engineering Attack Scenarios Analyzed

1. **Digital Arrest & Authority Impersonation**:
   - Attackers pose as CBI, Police, or Supreme Court officials.
   - Demand victims isolate themselves in locked rooms on continuous video calls under threat of non-bailable arrest warrants.
   - Demand fund transfers to a "government safe account."

2. **Bank KYC & OTP Harvesting**:
   - Attackers pose as State Bank or HDFC fraud teams.
   - Threaten account deactivation within 15 minutes unless an OTP or net banking PIN is surrendered.

3. **Remote Desktop Hijacking**:
   - Attackers pose as tech support engineers or utility agents.
   - Instruct targets to install AnyDesk, TeamViewer, or QuickSupport to gain unhindered screen and device control.

4. **Contraband Parcel Scams**:
   - Attackers claim a FedEx or DHL courier under the victim's Aadhaar was intercepted with illegal drugs or fake passports.

5. **Utility & Disconnection Threats**:
   - Attackers claim power or telecom SIM will be disconnected within hours due to unpaid arrears.

6. **Distress & Kidnapping Scams**:
   - Attackers claim a child or relative has been jailed or injured, demanding immediate emergency bail or hospital funds.

---

## 4. STRIDE Threat Analysis

| Threat | System Vulnerability | Mitigation Implemented |
| :--- | :--- | :--- |
| **Spoofing** | Forged user identity in API requests | Cryptographic JWT authentication; `user_id` extracted strictly from validated bearer token claims. |
| **Tampering** | Corrupted or poisoned audio streams | Binary magic byte validation (`RIFF`, `ID3`, `EBML`); strict MIME type and extension white-listing. |
| **Repudiation** | Lack of forensic auditability | Immutable incident reports stamped with UTC timestamps, unique analysis IDs, and exported PDF records. |
| **Information Disclosure** | Cross-user report leakage | PostgreSQL Row Level Security (RLS) policies; 404 response on unauthorized queries to prevent user enumeration. |
| **Denial of Service** | Oversized audio files or memory exhaustion | Strict 25MB file size limit, 600s audio duration cap, and bounded async threadpool execution. |
| **Elevation of Privilege** | Path traversal or command injection in filenames | Rigorous filename sanitization stripping all directory traversal (`../`) and shell injection metacharacters. |

---

## 5. Defensive Privacy & Safe Execution Policies

- **Ephemeral Audio by Default**: Audio recordings are treated as toxic assets. Raw audio is processed in temporary memory/disk buffers and scrubbed immediately (`finally: cleanup_file()`).
- **No External Auto-Actions**: VoiceShield AI **never** automatically visits links, dials phone numbers, or executes scripts extracted from spoken transcripts.
- **Explainable Disclaimers**: Explicitly communicates that AI scores provide defensive advisory guidance and do not constitute authorized legal evidence or absolute proof of deepfake cloning.
