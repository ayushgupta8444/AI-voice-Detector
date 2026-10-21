import os
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Analysis, AudioAuthenticityResult, UserSettings, generate_uuid, utc_now
from app.schemas.schemas import AnalysisResponse, TranscriptAnalyzeRequest, AuthenticityResponse
from app.utils.security import get_optional_user
from app.utils.validators import validate_audio_file
from app.services.audio_processing import (
    save_temp_audio, get_audio_metadata, validate_audio_duration,
    persist_audio_if_enabled, cleanup_file
)
from app.services.transcription import transcribe_audio
from app.services.scam_detector import detect_scam_indicators
from app.services.risk_scorer import calculate_scam_risk
from app.services.audio_authenticity import analyze_audio_authenticity
from app.services.safe_actions import generate_safe_actions

router = APIRouter(prefix="", tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_audio(
    file: UploadFile = File(...),
    language: Optional[str] = Form(None),
    edited_transcript: Optional[str] = Form(None),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Accepts an audio recording/upload (WAV, MP3, M4A, WebM, OGG),
    validates the file, extracts speech with Whisper STT,
    detects scam indicators, evaluates risk score, runs experimental
    signal forensics, and produces an explainable cybersecurity report.
    """
    content = await file.read()
    clean_filename = validate_audio_file(file, content)
    ext = clean_filename.rsplit(".", 1)[-1].lower()

    temp_path = None
    retained_path = None

    try:
        # Save temporary file for processing
        temp_path = save_temp_audio(content, ext)

        # Validate audio duration
        duration, sample_rate, channels = get_audio_metadata(temp_path)
        validate_audio_duration(duration)

        # Speech-to-Text Transcription
        transcription_model_name = "faster-whisper-tiny"
        if edited_transcript and edited_transcript.strip():
            transcript = edited_transcript.strip()
            detected_lang = language or "en"
            transcript_source = "user_edited"
        else:
            transcription_result = transcribe_audio(temp_path, requested_language=language)
            transcript = transcription_result["transcript"]
            detected_lang = transcription_result["language"]
            transcription_model_name = transcription_result["model_name"]
            transcript_source = "whisper_model"

        if not transcript:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="No spoken words could be recognized in this audio. The recording may be silent, indistinct, or masked by background noise."
            )

        # Scam Indicator Detection (Rule-based)
        indicators = detect_scam_indicators(transcript)

        # Explainable Scam Risk Scoring
        scam_score, scam_category, evidence_excerpts, rationale = calculate_scam_risk(indicators, transcript)

        # Contextual Safe Action Recommendations
        safe_actions = generate_safe_actions(indicators)

        # Experimental Acoustic Authenticity Analysis (Kept strictly separate!)
        authenticity_dict = analyze_audio_authenticity(temp_path)

        # Audio Retention Handling
        user_retention_enabled = False
        if current_user:
            user_settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
            if user_settings and user_settings.audio_retention_enabled:
                user_retention_enabled = True

        retained_path = persist_audio_if_enabled(temp_path, user_retention_enabled)

        # Save to Database if user is authenticated
        analysis_record = Analysis(
            user_id=current_user.id if current_user else None,
            original_filename=clean_filename,
            audio_duration_seconds=round(duration, 2),
            detected_language=detected_lang,
            transcript=transcript,
            transcript_source=transcript_source,
            scam_risk_score=scam_score,
            scam_risk_category=scam_category,
            detected_indicators=indicators,
            evidence_excerpts=evidence_excerpts,
            recommended_actions=safe_actions,
            transcription_model=transcription_model_name,
            detection_method_version="VoiceShield-Rules-v1.0",
            processing_status="completed",
            retained_audio_path=retained_path
        )

        if current_user:
            db.add(analysis_record)
            db.flush()

            if authenticity_dict:
                auth_record = AudioAuthenticityResult(
                    analysis_id=analysis_record.id,
                    model_name=authenticity_dict["model_name"],
                    model_version=authenticity_dict["model_version"],
                    estimated_risk_score=authenticity_dict["estimated_risk_score"],
                    result_summary=authenticity_dict["result_summary"],
                    limitations=authenticity_dict["limitations"],
                    acoustic_metrics=authenticity_dict.get("acoustic_metrics", {})
                )
                db.add(auth_record)

            db.commit()
            db.refresh(analysis_record)

        # Prepare response
        auth_resp = None
        if authenticity_dict:
            auth_resp = AuthenticityResponse(
                id=None,
                model_name=authenticity_dict["model_name"],
                model_version=authenticity_dict["model_version"],
                estimated_risk_score=authenticity_dict["estimated_risk_score"],
                result_summary=authenticity_dict["result_summary"],
                limitations=authenticity_dict["limitations"],
                acoustic_metrics=authenticity_dict.get("acoustic_metrics", {}),
                created_at=None
            )

        return AnalysisResponse(
            id=analysis_record.id,
            user_id=analysis_record.user_id,
            original_filename=analysis_record.original_filename,
            audio_duration_seconds=analysis_record.audio_duration_seconds,
            detected_language=analysis_record.detected_language,
            transcript=analysis_record.transcript,
            transcript_source=analysis_record.transcript_source,
            scam_risk_score=analysis_record.scam_risk_score,
            scam_risk_category=analysis_record.scam_risk_category,
            detected_indicators=analysis_record.detected_indicators,
            evidence_excerpts=analysis_record.evidence_excerpts,
            recommended_actions=analysis_record.recommended_actions,
            transcription_model=analysis_record.transcription_model,
            detection_method_version=analysis_record.detection_method_version,
            processing_status=analysis_record.processing_status,
            retained_audio_path=analysis_record.retained_audio_path,
            authenticity=auth_resp,
            created_at=analysis_record.created_at
        )

    finally:
        # Secure cleanup: Remove temporary audio from disk
        cleanup_file(temp_path)

@router.post("/analyze-transcript", response_model=AnalysisResponse)
def analyze_transcript_only(
    payload: TranscriptAnalyzeRequest,
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Analyzes user-provided text transcript without audio processing.
    Clearly labels result as transcript-based rather than audio-verified.
    """
    transcript = payload.transcript.strip()
    if not transcript:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript text cannot be empty."
        )

    # Detect indicators
    indicators = detect_scam_indicators(transcript)

    # Compute risk score
    scam_score, scam_category, evidence_excerpts, rationale = calculate_scam_risk(indicators, transcript)

    # Generate safe recommendations
    safe_actions = generate_safe_actions(indicators)

    # Save to Database if user is authenticated
    analysis_record = Analysis(
        user_id=current_user.id if current_user else None,
        original_filename=payload.original_filename or "manual_transcript.txt",
        audio_duration_seconds=None,
        detected_language=payload.language or "en",
        transcript=transcript,
        transcript_source="manual_input",
        scam_risk_score=scam_score,
        scam_risk_category=scam_category,
        detected_indicators=indicators,
        evidence_excerpts=evidence_excerpts,
        recommended_actions=safe_actions,
        transcription_model="none_text_only",
        detection_method_version="VoiceShield-Rules-v1.0",
        processing_status="completed",
        retained_audio_path=None
    )

    if current_user:
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)

    return AnalysisResponse(
        id=analysis_record.id,
        user_id=analysis_record.user_id,
        original_filename=analysis_record.original_filename,
        audio_duration_seconds=None,
        detected_language=analysis_record.detected_language,
        transcript=analysis_record.transcript,
        transcript_source="manual_input",
        scam_risk_score=analysis_record.scam_risk_score,
        scam_risk_category=analysis_record.scam_risk_category,
        detected_indicators=analysis_record.detected_indicators,
        evidence_excerpts=analysis_record.evidence_excerpts,
        recommended_actions=analysis_record.recommended_actions,
        transcription_model=analysis_record.transcription_model,
        detection_method_version=analysis_record.detection_method_version,
        processing_status=analysis_record.processing_status,
        retained_audio_path=None,
        authenticity=None, # Explicitly unavailable for text-only analysis
        created_at=analysis_record.created_at
    )
