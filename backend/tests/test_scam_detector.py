import pytest
from app.services.scam_detector import detect_scam_indicators

def test_detect_otp_harvesting():
    text = "Please share the 6-digit OTP code sent to your phone immediately to verify your account."
    indicators = detect_scam_indicators(text)
    indicator_ids = [ind["id"] for ind in indicators]
    assert "IND_CRED_01" in indicator_ids
    assert "IND_URG_01" in indicator_ids
    # Verify offsets
    otp_ind = next(ind for ind in indicators if ind["id"] == "IND_CRED_01")
    assert otp_ind["char_start"] >= 0
    assert otp_ind["char_end"] > otp_ind["char_start"]
    assert otp_ind["matched_phrase"].lower() in text.lower()

def test_detect_remote_access_anydesk():
    text = "You need to download AnyDesk from the Play Store so our engineer can fix the issue."
    indicators = detect_scam_indicators(text)
    indicator_ids = [ind["id"] for ind in indicators]
    assert "IND_REMOTE_01" in indicator_ids

def test_detect_digital_arrest_and_cbi():
    text = "You are placed under digital arrest by the CBI Crime Branch. Do not disconnect the call."
    indicators = detect_scam_indicators(text)
    indicator_ids = [ind["id"] for ind in indicators]
    assert "IND_IMP_LAW" in indicator_ids
    assert "IND_SECRECY_01" in indicator_ids

def test_detect_hindi_scam_phrases():
    text = "Namaste sir, bank se bol raha hoon, turant apna OTP bataiye warna khata band ho jayega."
    indicators = detect_scam_indicators(text)
    indicator_ids = [ind["id"] for ind in indicators]
    assert "IND_CRED_01" in indicator_ids
    assert "IND_URG_01" in indicator_ids

def test_benign_text_has_zero_scam_indicators():
    text = "Good morning team, let's review the quarterly sales figures and prepare for next week's client presentation."
    indicators = detect_scam_indicators(text)
    assert len(indicators) == 0

def test_empty_and_whitespace_text():
    assert detect_scam_indicators("") == []
    assert detect_scam_indicators("   \n\t  ") == []
