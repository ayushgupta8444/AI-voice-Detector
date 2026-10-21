import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_database():
    init_db()

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "capabilities" in data
    assert "speech_to_text" in data["capabilities"]
    assert "scam_detection" in data["capabilities"]

def test_auth_workflow_and_user_isolation():
    # 1. Register User A
    import uuid
    uid = uuid.uuid4().hex[:8]
    email_a = f"user_a_{uid}@voiceshield.test"
    res_reg_a = client.post("/api/auth/register", json={
        "email": email_a,
        "password": "Password123!",
        "display_name": "Alice Cyber"
    })
    assert res_reg_a.status_code in [201, 400]
    
    # Login User A
    res_login_a = client.post("/api/auth/login", json={
        "email": email_a,
        "password": "Password123!"
    })
    assert res_login_a.status_code == 200
    token_a = res_login_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # Verify /me for User A
    res_me_a = client.get("/api/auth/me", headers=headers_a)
    assert res_me_a.status_code == 200
    assert res_me_a.json()["email"] == email_a

    # 2. User A performs a transcript analysis
    scam_transcript = "CBI headquarters notice. You are under digital arrest. Transfer 50000 rupees to safe account immediately."
    res_analysis = client.post(
        "/api/analyze-transcript",
        json={"transcript": scam_transcript},
        headers=headers_a
    )
    assert res_analysis.status_code == 200
    analysis_data = res_analysis.json()
    analysis_id = analysis_data["id"]
    assert analysis_data["scam_risk_category"] in ["High Risk", "Critical Risk"]

    # 3. Register and Login User B
    email_b = f"user_b_{uid}@voiceshield.test"
    client.post("/api/auth/register", json={
        "email": email_b,
        "password": "Password456!",
        "display_name": "Bob Analyst"
    })
    res_login_b = client.post("/api/auth/login", json={
        "email": email_b,
        "password": "Password456!"
    })
    token_b = res_login_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 4. User B attempts to access User A's analysis (Must be BLOCKED!)
    res_unauth_access = client.get(f"/api/analyses/{analysis_id}", headers=headers_b)
    assert res_unauth_access.status_code == 404 # 404 prevents data leak enumeration

    # 5. User A can view their own analysis
    res_auth_access = client.get(f"/api/analyses/{analysis_id}", headers=headers_a)
    assert res_auth_access.status_code == 200
    assert res_auth_access.json()["id"] == analysis_id

    # 6. User A exports PDF
    res_pdf = client.get(f"/api/analyses/{analysis_id}/pdf", headers=headers_a)
    assert res_pdf.status_code == 200
    assert res_pdf.headers["content-type"] == "application/pdf"
    assert len(res_pdf.content) > 500

    # 7. User A reads and updates privacy settings
    res_settings = client.get("/api/settings", headers=headers_a)
    assert res_settings.status_code == 200
    assert res_settings.json()["audio_retention_enabled"] is False

    res_settings_patch = client.patch(
        "/api/settings",
        json={"audio_retention_enabled": True, "audio_retention_duration": 14},
        headers=headers_a
    )
    assert res_settings_patch.status_code == 200
    assert res_settings_patch.json()["audio_retention_enabled"] is True
    assert res_settings_patch.json()["audio_retention_duration"] == 14
