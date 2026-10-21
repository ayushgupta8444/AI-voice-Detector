import io
from typing import Dict, Any
from fpdf import FPDF
from app.config import settings

class VoiceShieldPDF(FPDF):
    def header(self):
        # Header banner
        self.set_fill_color(10, 14, 23) # Dark navy
        self.rect(0, 0, 210, 24, 'F')
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(6, 182, 212) # Cyan
        self.set_xy(10, 7)
        self.cell(0, 10, "VOICESHIELD AI  |  CYBERSECURITY INCIDENT REPORT", 0, 0, 'L')
        self.set_font('Helvetica', '', 8)
        self.set_text_color(148, 163, 184) # Muted gray
        self.set_xy(140, 7)
        self.cell(60, 10, "INS Expo Forensics", 0, 0, 'R')
        self.ln(20)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 10, f"Page {self.page_no()} - VoiceShield AI Defensive Cybersecurity Platform - Official Helplines: Dial 1930 | cybercrime.gov.in", 0, 0, 'C')

def generate_pdf_report(analysis_dict: Dict[str, Any]) -> bytes:
    """Generates an incident report PDF in memory and returns raw bytes."""
    pdf = VoiceShieldPDF()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    # Document Title
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "Voice Scam & Social Engineering Risk Assessment", 0, 1, 'L')
    pdf.ln(2)

    # Incident Overview Block
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(226, 232, 240)
    pdf.rect(10, 36, 190, 28, 'DF')

    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(71, 85, 105)
    pdf.set_xy(14, 38)
    pdf.cell(40, 6, "Analysis ID:", 0, 0)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(50, 6, str(analysis_dict.get('id', 'N/A'))[:18] + "...", 0, 0)

    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(40, 6, "Analyzed At:", 0, 0)
    pdf.set_font('Helvetica', '', 9)
    created_at = str(analysis_dict.get('created_at', ''))[:19]
    pdf.cell(50, 6, created_at, 0, 1)

    pdf.set_xy(14, 46)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(40, 6, "Source File:", 0, 0)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(50, 6, str(analysis_dict.get('original_filename', 'N/A')), 0, 0)

    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(40, 6, "Audio Duration:", 0, 0)
    pdf.set_font('Helvetica', '', 9)
    dur = analysis_dict.get('audio_duration_seconds')
    pdf.cell(50, 6, f"{dur:.1f}s" if dur else "Text-only", 0, 1)

    pdf.set_xy(14, 54)
    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(40, 6, "Detected Language:", 0, 0)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(50, 6, str(analysis_dict.get('detected_language', 'en')).upper(), 0, 0)

    pdf.set_font('Helvetica', 'B', 9)
    pdf.cell(40, 6, "Analysis Engine:", 0, 0)
    pdf.set_font('Helvetica', '', 9)
    pdf.cell(50, 6, str(analysis_dict.get('detection_method_version', 'VoiceShield-Rules-v1.0')), 0, 1)

    pdf.ln(10)

    # Risk Score & Category Banner
    score = float(analysis_dict.get('scam_risk_score', 0.0))
    category = str(analysis_dict.get('scam_risk_category', 'Low Risk'))

    if score >= 85.0:
        pdf.set_fill_color(255, 228, 230) # Red
        pdf.set_text_color(225, 29, 72)
    elif score >= 60.0:
        pdf.set_fill_color(255, 237, 213) # Orange
        pdf.set_text_color(234, 88, 12)
    elif score >= 30.0:
        pdf.set_fill_color(254, 249, 195) # Yellow
        pdf.set_text_color(161, 98, 7)
    else:
        pdf.set_fill_color(220, 252, 231) # Green
        pdf.set_text_color(22, 101, 52)

    pdf.rect(10, 70, 190, 18, 'F')
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_xy(14, 74)
    pdf.cell(100, 10, f"SCAM RISK ASSESSMENT: {category.upper()}", 0, 0)
    pdf.set_xy(140, 74)
    pdf.cell(55, 10, f"Score: {score:.1f} / 100", 0, 1, 'R')

    pdf.ln(12)

    # Detected Indicators Section
    pdf.set_text_color(15, 23, 42)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, "Detected Scam Indicators & Social Engineering Tactics", 0, 1)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(4)

    indicators = analysis_dict.get('detected_indicators', [])
    if not indicators:
        pdf.set_font('Helvetica', '', 10)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(0, 6, "No known scam or social engineering indicators were detected in this transcript.", 0, 1)
    else:
        for idx, ind in enumerate(indicators, 1):
            pdf.set_font('Helvetica', 'B', 10)
            pdf.set_text_color(225, 29, 72) if ind.get('severity') == 'critical' else pdf.set_text_color(15, 23, 42)
            pdf.cell(0, 6, f"{idx}. [{ind.get('severity', '').upper()}] {ind.get('name', 'Indicator')}", 0, 1)

            pdf.set_x(10)
            pdf.set_font('Helvetica', 'I', 9)
            pdf.set_text_color(51, 65, 85)
            pdf.multi_cell(pdf.epw, 5, f"Matched Excerpt: \"{ind.get('excerpt', '')}\"")

            pdf.set_x(10)
            pdf.set_font('Helvetica', '', 9)
            pdf.set_text_color(71, 85, 105)
            pdf.multi_cell(pdf.epw, 5, f"Analysis: {ind.get('explanation', '')}")
            pdf.ln(2)

    pdf.ln(4)

    # Audio Authenticity Forensics Section (if present)
    auth = analysis_dict.get('authenticity')
    if auth:
        pdf.set_x(10)
        pdf.set_text_color(15, 23, 42)
        pdf.set_font('Helvetica', 'B', 12)
        pdf.cell(0, 8, "Acoustic Authenticity & Synthetic Speech Forensics (Experimental)", 0, 1)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(4)

        pdf.set_x(10)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(50, 6, "Acoustic Forensic Engine:", 0, 0)
        pdf.set_font('Helvetica', '', 10)
        pdf.cell(0, 6, f"{auth.get('model_name', 'VoiceShield Forensics')} v{auth.get('model_version', '1.0')}", 0, 1)

        pdf.set_x(10)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(50, 6, "Synthetic Anomaly Score:", 0, 0)
        pdf.set_font('Helvetica', '', 10)
        synth_score = auth.get('estimated_risk_score')
        pdf.cell(0, 6, f"{synth_score:.1f}% estimated synthetic anomaly index" if synth_score is not None else "N/A", 0, 1)

        pdf.set_x(10)
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(71, 85, 105)
        pdf.multi_cell(pdf.epw, 5, f"Summary: {auth.get('result_summary', '')}")
        pdf.ln(2)

    # Safe Action Recommendations Section
    pdf.set_x(10)
    pdf.set_text_color(15, 23, 42)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, "Recommended Safe Cybersecurity Actions", 0, 1)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(4)

    actions = analysis_dict.get('recommended_actions', [])
    for act in actions:
        pdf.set_x(10)
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(30, 41, 59)
        pdf.multi_cell(pdf.epw, 5, f"* {act}")
        pdf.ln(1)

    pdf.ln(4)

    # Spoken Transcript Excerpt
    pdf.set_x(10)
    pdf.set_text_color(15, 23, 42)
    pdf.set_font('Helvetica', 'B', 12)
    pdf.cell(0, 8, "Transcription Record", 0, 1)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(4)

    pdf.set_x(10)
    pdf.set_font('Courier', '', 8)
    pdf.set_text_color(51, 65, 85)
    transcript_text = str(analysis_dict.get('transcript', 'No transcript available.'))
    if len(transcript_text) > 1500:
        transcript_text = transcript_text[:1500] + "\n... [Transcript truncated in PDF summary view]"
    pdf.multi_cell(pdf.epw, 4, transcript_text)

    # Return PDF binary
    return pdf.output()
