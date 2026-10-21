import pytest
from app.services.risk_scorer import calculate_scam_risk

def test_risk_scorer_empty_indicators():
    score, category, excerpts, rationale = calculate_scam_risk([], "benign text")
    assert score == 0.0
    assert category == "Low Risk"
    assert excerpts == []

def test_risk_scorer_critical_threshold():
    # Combining OTP + Urgency + Money Transfer
    indicators = [
        {"id": "IND_CRED_01", "category": "credentials", "weight": 35.0, "excerpt": "share OTP"},
        {"id": "IND_URG_01", "category": "urgency", "weight": 20.0, "excerpt": "immediately"},
        {"id": "IND_FIN_TRANSFER", "category": "financial", "weight": 35.0, "excerpt": "transfer funds"}
    ]
    score, category, excerpts, rationale = calculate_scam_risk(indicators, "sample text")
    assert score >= 85.0
    assert category == "Critical Risk"
    assert len(excerpts) == 3

def test_risk_scorer_medium_threshold():
    indicators = [
        {"id": "IND_URG_01", "category": "urgency", "weight": 20.0, "excerpt": "urgently"}
    ]
    score, category, excerpts, rationale = calculate_scam_risk(indicators, "sample text")
    assert score < 30.0 # Single urgency weight is 20 -> Low Risk
    assert category == "Low Risk"

    # Add authority impersonation
    indicators.append(
        {"id": "IND_IMP_BANK", "category": "impersonation", "weight": 25.0, "excerpt": "bank manager"}
    )
    score, category, excerpts, rationale = calculate_scam_risk(indicators, "sample text")
    # Base 45 * compound 1.2 = 54 -> Medium Risk
    assert 30.0 <= score < 60.0
    assert category == "Medium Risk"

def test_score_bounded_between_zero_and_hundred():
    # Super high indicators that exceed 100
    indicators = [
        {"id": f"IND_{i}", "category": "credentials", "weight": 40.0, "excerpt": f"item {i}"}
        for i in range(5)
    ]
    score, category, excerpts, rationale = calculate_scam_risk(indicators, "sample text")
    assert score <= 100.0
    assert score >= 0.0
