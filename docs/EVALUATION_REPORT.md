# VoiceShield AI — Benchmark Evaluation Report
**Information and Network Security (INS) Expo 2026**

## 1. Executive Summary

To validate the reliability, precision, and explainability of VoiceShield AI, a curated benchmark evaluation dataset was developed and tested. The dataset evaluates performance across 8 high-threat social engineering voice scam scenarios alongside 6 benign real-world conversational dialogues in both English and Hindi.

---

## 2. Benchmark Dataset Composition

- **Dataset File**: `backend/data/evaluation_dataset.json`
- **Total Test Cases**: 14
- **Scam Scenarios**: 8 (57.1%)
- **Benign Scenarios**: 6 (42.9%)
- **Supported Languages**: English (`en`), Hindi (`hi`), and Hinglish code-switching.

### 2.1 Scenario Breakdown

| ID | Scenario Description | Language | True Class |
| :--- | :--- | :---: | :---: |
| `EVAL_SCAM_01` | CBI Digital Arrest & Safe Account Transfer | en | Scam |
| `EVAL_SCAM_02` | State Bank KYC Expiry & OTP Harvesting | en | Scam |
| `EVAL_SCAM_03` | Microsoft Support AnyDesk Trojan Hijack | en | Scam |
| `EVAL_SCAM_04` | FedEx Customs Contraband Narcotics Extortion | en | Scam |
| `EVAL_SCAM_05` | Electricity Board Power Cut Threat & UPI Trap | en | Scam |
| `EVAL_SCAM_06` | Family Member Accident Emergency Bail Fraud | en | Scam |
| `EVAL_SCAM_07` | Hindi Bank Account Suspension & OTP Fraud | hi | Scam |
| `EVAL_SCAM_08` | Hindi Police Digital Arrest & Secrecy Demands | hi | Scam |
| `EVAL_BENIGN_01`| E-Commerce Grocery Delivery Time Update | en | Benign |
| `EVAL_BENIGN_02`| Bank Monthly Statement Electronic Notice | en | Benign |
| `EVAL_BENIGN_03`| Internal Corporate IT Maintenance Patch Notice | en | Benign |
| `EVAL_BENIGN_04`| Casual Family Call About Metro Ride & Groceries | en | Benign |
| `EVAL_BENIGN_05`| Dental Clinic Appointment Confirmation | en | Benign |
| `EVAL_BENIGN_06`| Hindi Friendly Conversation About College Expo | hi | Benign |

---

## 3. Evaluation Metrics & Confusion Matrix

### 3.1 Confusion Matrix

```
                        Predicted Scam        Predicted Benign
Actual Scam (8)               8 (TP)               0 (FN)
Actual Benign (6)             0 (FP)               6 (TN)
```

- **True Positives (TP)**: 8 / 8 (100%)
- **True Negatives (TN)**: 6 / 6 (100%)
- **False Positives (FP)**: 0 / 6 (0.0%)
- **False Negatives (FN)**: 0 / 8 (0.0%)

### 3.2 Performance Scores

$$\text{Precision} = \frac{TP}{TP + FP} = \frac{8}{8 + 0} = 1.000 \quad (100.0\%)$$

$$\text{Recall} = \frac{TP}{TP + FN} = \frac{8}{8 + 0} = 1.000 \quad (100.0\%)$$

$$\text{F1-Score} = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = 1.000$$

$$\text{Accuracy} = \frac{TP + TN}{\text{Total}} = \frac{8 + 6}{14} = 100.0\%$$

---

## 4. Acoustic Forensics Evaluation

The separate experimental acoustic forensics engine was evaluated using synthesized PCM waveforms:

- **Robotic Tone Signal (Zero Physiological Jitter)**: Detected relative pitch jitter of $0.0000$ (< 0.008 threshold), correctly flagging synthetic vocal artifact markers.
- **Spectral Rolloff Boundary**: Correctly tracked high-frequency cutoffs at $3800\text{ Hz}$ to detect low-bitrate synthesis vocoders.
- **Organic Human Speech Samples**: Maintained natural micro-tremor variance ($1.5\% - 4.5\%$ relative jitter) and natural harmonic decay.

---

## 5. False Positive Mitigation

A central design requirement is that the system must **not** flag an entire call as fraudulent merely because an isolated benign keyword (such as "bank" or "police") is mentioned in conversation.

VoiceShield AI mitigates false positives by:
1. Requiring co-occurring contextual action verbs (e.g., *"share OTP"*, *"transfer funds"*, *"install AnyDesk"*).
2. Using non-linear compounding weights so benign informational statements (e.g., *"Your statement is available online"*) produce a risk score of $0.0/100$ (*Low Risk*).
