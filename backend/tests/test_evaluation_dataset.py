import json
import os
import pytest
from app.services.scam_detector import detect_scam_indicators
from app.services.risk_scorer import calculate_scam_risk

def test_evaluation_dataset_metrics():
    """
    Evaluates the labelled dataset across benign and scam scenarios.
    Calculates and asserts Precision, Recall, F1-Score, and Confusion Matrix.
    """
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "data", "evaluation_dataset.json")
    with open(dataset_path, "r", encoding="utf-8") as f:
        samples = json.load(f)

    tp = 0 # True Positives (Scam predicted as High/Critical Risk)
    fp = 0 # False Positives (Benign predicted as Scam)
    tn = 0 # True Negatives (Benign predicted as Low Risk)
    fn = 0 # False Negatives (Scam predicted as Low Risk)

    results = []

    for item in samples:
        transcript = item["transcript"]
        expected = item["expected_label"]

        indicators = detect_scam_indicators(transcript)
        score, category, excerpts, rationale = calculate_scam_risk(indicators, transcript)

        # A score >= 30 (Medium, High, or Critical) flags a potential scam risk
        is_scam_predicted = (category in ["Medium Risk", "High Risk", "Critical Risk"])

        if expected == "scam":
            if is_scam_predicted:
                tp += 1
            else:
                fn += 1
        elif expected == "benign":
            if is_scam_predicted:
                fp += 1
            else:
                tn += 1

        results.append({
            "id": item["id"],
            "expected": expected,
            "score": score,
            "category": category,
            "indicators_count": len(indicators)
        })

    total = len(samples)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    print("\n================ EVALUATION DATASET RESULTS ================")
    print(f"Total Test Cases: {total}")
    print(f"Confusion Matrix: TP={tp}, FP={fp}, TN={tn}, FN={fn}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1-Score:  {f1:.4f}")
    print("============================================================")

    # Assertions
    assert fp == 0, f"False Positives detected on benign samples! fp={fp}"
    assert fn == 0, f"False Negatives detected on scam samples! fn={fn}"
    assert precision == 1.0, f"Expected Precision 1.0, got {precision}"
    assert recall == 1.0, f"Expected Recall 1.0, got {recall}"
    assert f1 == 1.0, f"Expected F1-Score 1.0, got {f1}"
