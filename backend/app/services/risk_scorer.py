from typing import List, Dict, Any, Tuple

# Severity thresholds
SEVERITY_THRESHOLDS = {
    "LOW": (0.0, 29.99, "Low Risk"),
    "MEDIUM": (30.0, 59.99, "Medium Risk"),
    "HIGH": (60.0, 84.99, "High Risk"),
    "CRITICAL": (85.0, 100.0, "Critical Risk")
}

def calculate_scam_risk(indicators: List[Dict[str, Any]], transcript: str) -> Tuple[float, str, List[str], str]:
    """
    Computes an explainable scam risk score (0-100) from detected indicators.
    Returns:
        (score, category, evidence_excerpts, scoring_rationale)
    """
    if not indicators:
        return 0.0, "Low Risk", [], "No known scam or social engineering indicators were detected in this transcript."

    # 1. Base score from indicator weights
    raw_score = sum(ind.get("weight", 10.0) for ind in indicators)
    
    # 2. Extract categories present
    categories = set(ind.get("category") for ind in indicators)

    # 3. Compounding social engineering multipliers:
    # Multiple distinct attack vectors together indicate a coordinated attack scheme
    multipliers = 1.0
    compounding_reasons = []

    if "impersonation" in categories and "urgency" in categories:
        multipliers += 0.20
        compounding_reasons.append("Compounded by authority impersonation paired with extreme urgency")

    if "credentials" in categories and ("financial" in categories or "remote_access" in categories):
        multipliers += 0.25
        compounding_reasons.append("Compounded by credential/OTP harvesting combined with direct financial or remote access demands")

    if "threats" in categories and "emotional_manipulation" in categories:
        multipliers += 0.15
        compounding_reasons.append("Compounded by punitive legal threats enforced via isolation/secrecy")

    calculated_score = raw_score * multipliers

    # Cap score strictly between 0.0 and 100.0
    final_score = min(100.0, max(0.0, round(calculated_score, 1)))

    # Determine risk category
    if final_score >= 85.0:
        category = "Critical Risk"
    elif final_score >= 60.0:
        category = "High Risk"
    elif final_score >= 30.0:
        category = "Medium Risk"
    else:
        category = "Low Risk"

    # Gather evidence excerpts
    evidence_excerpts = [ind["excerpt"] for ind in indicators if "excerpt" in ind]

    # Rationale summary
    rationale_parts = [
        f"Base indicator score {raw_score:.1f} calculated across {len(indicators)} detected warning sign(s)."
    ]
    if compounding_reasons:
        rationale_parts.append("; ".join(compounding_reasons) + f" (compound factor {multipliers:.2f}x).")
    rationale_parts.append(f"Resulting in final calibrated risk score of {final_score}/100 categorized as {category}.")

    scoring_rationale = " ".join(rationale_parts)

    return final_score, category, evidence_excerpts, scoring_rationale

def get_risk_limitations() -> str:
    """Returns standard transparent cybersecurity limitations disclosure."""
    return (
        "Disclaimer & Limitations: This analysis reflects automated pattern recognition on spoken content. "
        "Audio quality, regional dialects, background noise, or colloquial expressions may affect transcription accuracy. "
        "A high scam score indicates strong alignment with known social engineering techniques and warrants immediate caution, "
        "but should not be treated as a definitive legal determination. Never rely solely on AI for legal or financial disputes."
    )
