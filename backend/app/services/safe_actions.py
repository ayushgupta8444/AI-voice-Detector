from typing import List, Dict, Any
from app.config import settings

def generate_safe_actions(indicators: List[Dict[str, Any]]) -> List[str]:
    """
    Produces actionable cybersecurity defense recommendations customized
    to the specific attack vectors detected in the transcript.
    """
    categories = set(ind.get("category") for ind in indicators)
    actions = []

    # 1. Credential theft defense
    if "credentials" in categories:
        actions.append(
            "NEVER disclose OTPs, PINs, passwords, or card CVVs. Legitimate banks and support teams have no operational need to ask for them."
        )

    # 2. Financial transfer defense
    if "financial" in categories:
        actions.append(
            "HALT all pending money transfers immediately. Do not transfer funds to any 'safe account', escrow, or personal UPI ID provided by the caller."
        )

    # 3. Authority impersonation & Digital arrest defense
    if "impersonation" in categories:
        actions.append(
            "Independently verify caller identity. Police, CBI, ED, and courts in India NEVER conduct 'digital arrests' or legal proceedings over WhatsApp or Skype."
        )
        actions.append(
            "If the caller claims to be your bank, hang up and call the customer care number printed on the back of your official debit/credit card."
        )

    # 4. Remote access software defense
    if "remote_access" in categories:
        actions.append(
            "REFUSE requests to install AnyDesk, TeamViewer, RustDesk, or QuickSupport. If already installed, turn off Wi-Fi/mobile data and uninstall the app immediately."
        )

    # 5. Threats & intimidation defense
    if "threats" in categories or "urgency" in categories:
        actions.append(
            "Do not yield to threats of imminent arrest, utility disconnection, or SIM deactivation. Scammers rely on manufactured panic to short-circuit critical thinking."
        )

    # 6. Secrecy & Isolation defense
    if "emotional_manipulation" in categories:
        actions.append(
            "Break the enforced secrecy. Inform a trusted family member, colleague, or legal counselor before taking any action or transferring any money."
        )

    # 7. Payment links defense
    if "payment_methods" in categories:
        actions.append(
            "Never scan unknown QR codes or click unexpected payment links. Entering your UPI PIN is ONLY used to send money, never to receive it."
        )

    # Default baseline cybersecurity measures
    if not actions:
        actions.append(
            "No high-severity scam indicators were detected, but maintain general vigilance: never share credentials or send money to unverified contacts."
        )

    # Evidence preservation and reporting recommendations
    actions.append(
        "Preserve evidence: save call logs, caller phone numbers, timestamps, and recording files for reporting."
    )
    actions.append(
        f"Report cyber fraud immediately to the National Cyber Crime Reporting Portal ({settings.INDIAN_CYBERCRIME_PORTAL_URL}) or dial Cyber Helpline {settings.INDIAN_CYBERCRIME_HELPLINE}."
    )
    actions.append(
        f"Report suspicious phone calls and SMS to the Department of Telecommunications (DoT) Chakshu portal ({settings.CHAKSHU_PORTAL_URL})."
    )

    return actions
