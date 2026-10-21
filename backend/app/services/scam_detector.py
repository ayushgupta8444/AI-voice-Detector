import re
from typing import List, Dict, Any

# Indicator definitions with regex patterns, weights, severities, and cyber explanations
SCAM_INDICATOR_RULES = [
    # 1. OTP & Credential Harvesting (Critical)
    {
        "id": "IND_CRED_01",
        "name": "OTP / One-Time Password Solicitation",
        "category": "credentials",
        "severity": "critical",
        "weight": 35.0,
        "patterns": [
            r"\b(?:otp|one[\s\-]time[\s\-]password|verification\s+code|security\s+code|auth\s+code|passcode)\b",
            r"\b(?:share|tell|give|read|enter|send|provide)\s+(?:me\s+)?(?:the\s+)?(?:otp|code|pin|password)\b",
            r"\b(?:6|4)[\s\-]digit\s+(?:code|otp|number)\b",
            r"\b(?:apna\s+)?otp\s+(?:batao|bataiye|share\s+karein|bhejo|de\s+do)\b",
            r"\bverification\s+code\s+(?:bataiye|bhejiye)\b"
        ],
        "explanation": "Legitimate organizations, banks, and officials NEVER request your OTP, PIN, or login password over the phone. Asking for an OTP is a universal hallmark of credential harvesting to execute unauthorized transactions or account takeovers."
    },
    {
        "id": "IND_CRED_02",
        "name": "Banking PIN or CVV Request",
        "category": "credentials",
        "severity": "critical",
        "weight": 35.0,
        "patterns": [
            r"\b(?:atm\s+pin|mpin|cvv|cvv2|card\s+number|expiry\s+date|net\s*banking\s+password)\b",
            r"\b(?:card\s+ke\s+peeche\s+ka|teen\s+ank\s+ka)\s+(?:number|cvv)\b"
        ],
        "explanation": "Requesting card CVV or ATM PIN is an immediate financial theft attempt. Banks already have your card details on file and never ask for the CVV or PIN."
    },

    # 2. Remote Access Applications (Critical)
    {
        "id": "IND_REMOTE_01",
        "name": "Remote Access Software Installation Request",
        "category": "remote_access",
        "severity": "critical",
        "weight": 35.0,
        "patterns": [
            r"\b(?:anydesk|teamviewer|rustdesk|quicksupport|ultraviewer|zoho\s+assist|any\s*desk)\b",
            r"\b(?:install|download|open)\s+(?:the\s+)?(?:app|application|software|tool)\s+(?:to\s+(?:verify|fix|check|support))\b",
            r"\b(?:screen\s+share|remote\s+access|remote\s+control|screen\s+mirroring)\b",
            r"\bplay\s*store\s+(?:se|mein)\s+(?:download|install)\s+karein\b"
        ],
        "explanation": "Scammers instruct victims to install remote desktop tools like AnyDesk or TeamViewer to gain total control over the victim's device, intercept OTP notifications, and siphon funds directly from banking apps."
    },

    # 3. Impersonation of Law Enforcement & 'Digital Arrest' (Critical)
    {
        "id": "IND_IMP_LAW",
        "name": "Law Enforcement / Digital Arrest Impersonation",
        "category": "impersonation",
        "severity": "critical",
        "weight": 30.0,
        "patterns": [
            r"\b(?:digital\s+arrest|digitally\s+arrested)\b",
            r"\b(?:cbi|central\s+bureau\s+of\s+investigation|crime\s+branch|cyber\s+crime\s+cell|ed|enforcement\s+directorate|narcotics\s+control\s+bureau|ncb|police\s+headquarters|dcp|sp|inspector)\b",
            r"\b(?:arrest\s+warrant|non[\s\-]bailable\s+warrant|fir\s+lodged|court\s+order|supreme\s+court|high\s+court)\b",
            r"\bpolice\s+(?:station|officer|thanedari|thana)\s+(?:se\s+bol\s+raha\s+hoon|calling)\b",
            r"\baapke\s+khilaf\s+(?:fir|case|complaint)\s+darj\s+hai\b"
        ],
        "explanation": "The 'Digital Arrest' scam is a severe social engineering tactic. Real police officers, CBI, or courts in India or abroad DO NOT conduct investigations or detain individuals over WhatsApp or Skype video calls, nor do they demand money to settle criminal cases."
    },

    # 4. Impersonation of Banks & Financial Authorities (High)
    {
        "id": "IND_IMP_BANK",
        "name": "Bank / Financial Authority Impersonation",
        "category": "impersonation",
        "severity": "high",
        "weight": 25.0,
        "patterns": [
            r"\b(?:reserve\s+bank\s+of\s+india|rbi|state\s+bank\s+of\s+india|sbi|hdfc\s+bank|icici\s+bank|punjab\s+national\s+bank|bank\s+manager|fraud\s+department|security\s+division)\b",
            r"\b(?:account\s+suspended|account\s+blocked|account\s+frozen|kyc\s+expired|kyc\s+update|pan\s+card\s+link|aadhaar\s+link)\b",
            r"\b(?:khata\s+block|khata\s+band|kyc\s+complete\s+nahi\s+hua)\b"
        ],
        "explanation": "Claiming that your bank account is blocked or KYC is expired creates panic, priming you to comply with urgent instructions without verifying directly with your bank branch."
    },

    # 5. Utility & Telecom Impersonation (High)
    {
        "id": "IND_IMP_UTILITY",
        "name": "Electricity / Telecom / Utility Impersonation",
        "category": "impersonation",
        "severity": "high",
        "weight": 25.0,
        "patterns": [
            r"\b(?:electricity\s+(?:board|department|office|corporation|authority|bill)|power\s+(?:supply|board)|trai|telecom\s+department|dot|discom|bses|bescom|uppcl|tneb|mseb)\b",
            r"\b(?:bijli\s+vibhag|bijli\s+board|power\s+office)\b"
        ],
        "explanation": "Scammers impersonate public utility boards (electricity/telecom) warning of immediate service cutoff due to fake unpaid bills, coercing targets into rapid panic payments."
    },

    # 6. Courier / Customs Contraband Parcel Scams (High)
    {
        "id": "IND_IMP_PARCEL",
        "name": "Customs / Courier Contraband Scam",
        "category": "impersonation",
        "severity": "high",
        "weight": 25.0,
        "patterns": [
            r"\b(?:fedex|dhl|blue\s+dart|customs\s+department|customs\s+office|airport\s+customs)\b",
            r"\b(?:parcel\s+seized|package\s+intercepted|illegal\s+items|contraband|drugs|narcotics|fake\s+passports|unauthorized\s+sims)\b",
            r"\b(?:taiwan|cambodia|dubai|international\s+courier)\s+(?:se\s+parcel|package)\b"
        ],
        "explanation": "Scammers falsely allege an outgoing international parcel under your Aadhaar/name was intercepted with illegal items (drugs, passports), using fear of criminal liability to transfer money to 'clear' your name."
    },

    # 7. Urgent Demands for Money Transfer & 'Safe Account' (Critical)
    {
        "id": "IND_FIN_TRANSFER",
        "name": "Unfamiliar / Safe Account Money Transfer Demand",
        "category": "financial",
        "severity": "critical",
        "weight": 35.0,
        "patterns": [
            r"\b(?:safe\s+account|rbi\s+verification\s+account|government\s+escrow|security\s+deposit|refundable\s+amount)\b",
            r"\b(?:transfer|send|deposit|wire)\s+(?:the\s+)?(?:money|funds|amount|cash)\s+(?:to\s+(?:this\s+)?(?:account|upi|number|id))\b",
            r"\b(?:surakshit\s+khate|paise\s+transfer|paise\s+bhejiye|deposit\s+karayein)\b",
            r"\b(?:98\s*%|100\s*%\s*refundable|verification\s+ke\s+baad\s+wapas)\b"
        ],
        "explanation": "The 'safe account' myth is one of the most destructive scam tactics. No government agency or legitimate bank will ever ask you to transfer personal funds into a 'safe' or 'secret' account for verification."
    },

    # 8. Extreme Urgency & Time Pressure (High)
    {
        "id": "IND_URG_01",
        "name": "Extreme Urgency & Time Pressure",
        "category": "urgency",
        "severity": "high",
        "weight": 20.0,
        "patterns": [
            r"\b(?:immediately|right\s+now|within\s+(?:5|10|15|30)\s+minutes|without\s+delay|urgently|at\s+once|pay\s+immediately)\b",
            r"\b(?:abhe\s+ke\s+abhe|turant|jaldi\s+karo|sirf\s+10\s+minute\s+hai)\b",
            r"\b(?:time\s+is\s+running\s+out|last\s+chance|final\s+warning|before\s+it\s+is\s+too\s+late)\b"
        ],
        "explanation": "Artificial time pressure is designed to provoke acute adrenaline, shutting down analytical thinking and preventing the victim from seeking second opinions or contacting authorities."
    },

    # 9. Threats of Immediate Action / Legal Consequences (High)
    {
        "id": "IND_THREAT_01",
        "name": "Threats of Arrest, Penalty, or Disconnection",
        "category": "threats",
        "severity": "high",
        "weight": 25.0,
        "patterns": [
            r"\b(?:you\s+will\s+be\s+arrested|police\s+will\s+arrive|jail|imprisonment|legal\s+action|court\s+case)\b",
            r"\b(?:sim\s+(?:card\s+)?(?:will\s+be\s+)?(?:deactivated|disconnected|blocked)|power\s+(?:supply\s+)?(?:will\s+be\s+)?(?:disconnected|cut|stopped)|electricity\s+(?:supply\s+)?(?:will\s+be\s+)?(?:cut|disconnected)|line\s+(?:will\s+be\s+)?(?:permanently\s+)?cut)\b",
            r"\b(?:giraftari|jail\s+bhej\s+denge|light\s+kat\s+jayegi|bijli\s+cut\s+jayegi)\b"
        ],
        "explanation": "Direct threats of imprisonment, electricity cutoff, or SIM deactivation are leveraged to intimidate targets into complying immediately without checking billing history or legal standing."
    },

    # 10. Coercion, Secrecy, & Isolation (High)
    {
        "id": "IND_SECRECY_01",
        "name": "Enforced Secrecy & Isolation Tactic",
        "category": "emotional_manipulation",
        "severity": "high",
        "weight": 25.0,
        "patterns": [
            r"\b(?:don'?t\s+tell\s+anyone|keep\s+this\s+(?:secret|confidential)|do\s+not\s+inform\s+your\s+family|do\s+not\s+hang\s+up)\b",
            r"\b(?:do\s+not|don'?t)\s+(?:disconnect|cut|hang\s+up|end)\s+(?:the\s+|this\s+)?(?:call|phone|line)\b",
            r"\b(?:stay\s+on\s+the\s+(?:call|line)|keep\s+the\s+call\s+connected|lock\s+your\s+room|isolate\s+yourself)\b",
            r"\b(?:kisi\s+ko\s+mat\s+batana|phone\s+mat\s+katna|line\s+par\s+raho|kamre\s+mein\s+akela\s+jao)\b"
        ],
        "explanation": "Scammers isolate victims by ordering them to remain on the line and forbidden from contacting spouses, lawyers, or children. This keeps the victim trapped in an echo chamber of fear."
    },

    # 11. Family Emergency / Kidnapping / Bail Scam (High)
    {
        "id": "IND_IMP_FAMILY",
        "name": "Family Emergency / Bail Impersonation",
        "category": "impersonation",
        "severity": "high",
        "weight": 25.0,
        "patterns": [
            r"\b(?:your\s+son|your\s+daughter|your\s+child|your\s+brother|your\s+relative)\s+(?:has\s+been\s+arrested|in\s+police\s+custody|in\s+hospital|had\s+an\s+accident)\b",
            r"\b(?:need\s+urgent\s+bail|doctor\s+needs\s+deposit|emergency\s+operation\s+money)\b",
            r"\b(?:aapka\s+beta|aapki\s+beti|bache\s+ko\s+pakad\s+liya|hospital\s+mein\s+hai)\b"
        ],
        "explanation": "Pretending a loved one has suffered an accident or arrest exploits deep emotional vulnerability to compel rapid money transfers before the victim can verify their loved one's actual safety."
    },

    # 12. Suspicious Payment Links, QR Codes, and UPI Traps (Medium)
    {
        "id": "IND_PAY_LINK",
        "name": "Suspicious Links, QR Codes, or Payment Traps",
        "category": "payment_methods",
        "severity": "medium",
        "weight": 15.0,
        "patterns": [
            r"\b(?:click\s+(?:on\s+)?(?:this\s+)?link|scan\s+(?:this\s+)?qr\s*code|qr\s*code\s+scan|upi\s+pin\s+to\s+receive)\b",
            r"\b(?:(?:pay\s+)?(?:through|via|on|using)\s+(?:this\s+)?(?:upi\s+link|link|qr\s*code|apk))\b",
            r"\b(?:download\s+this\s+apk|install\s+this\s+file|link\s+bhej\s+raha\s+hoon)\b",
            r"\b(?:paise\s+prapt\s+karne\s+ke\s+liye\s+pin\s+dalein|pin\s+to\s+receive\s+money)\b"
        ],
        "explanation": "A common fraud trick claims you must enter your UPI PIN to 'receive' money. In reality, entering a UPI PIN ALWAYS transfers money OUT of your account."
    }
]

def detect_scam_indicators(transcript: str) -> List[Dict[str, Any]]:
    """
    Analyzes the transcript against transparent cybersecurity scam rules.
    Extracts matched phrases, character offsets, context excerpts, and severity.
    """
    if not transcript or not transcript.strip():
        return []

    detected = []
    text_lower = transcript.lower()

    for rule in SCAM_INDICATOR_RULES:
        rule_matched = False
        for pattern_str in rule["patterns"]:
            if rule_matched:
                break
            try:
                pattern = re.compile(pattern_str, re.IGNORECASE)
                for match in pattern.finditer(transcript):
                    matched_text = match.group(0)
                    start_char = match.start()
                    end_char = match.end()

                    # Extract context excerpt (±45 characters)
                    ctx_start = max(0, start_char - 45)
                    ctx_end = min(len(transcript), end_char + 45)
                    excerpt = transcript[ctx_start:ctx_end].strip()
                    if ctx_start > 0:
                        excerpt = "..." + excerpt
                    if ctx_end < len(transcript):
                        excerpt = excerpt + "..."

                    detected.append({
                        "id": rule["id"],
                        "name": rule["name"],
                        "category": rule["category"],
                        "severity": rule["severity"],
                        "weight": rule["weight"],
                        "matched_phrase": matched_text,
                        "excerpt": excerpt,
                        "explanation": rule["explanation"],
                        "char_start": start_char,
                        "char_end": end_char
                    })
                    rule_matched = True
                    break # One instance per rule is sufficient for scoring
            except Exception as e:
                print(f"[ScamDetector] Regex error on pattern {pattern_str}: {e}")
                continue

    return detected
