import os
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database import get_db
from app.models.models import User, Analysis, AudioAuthenticityResult
from app.schemas.schemas import AnalysisResponse, AnalysesListResponse, DashboardStatsResponse, AuthenticityResponse
from app.utils.security import get_current_user
from app.services.report_export import generate_pdf_report
from app.services.audio_processing import cleanup_file

router = APIRouter(prefix="/analyses", tags=["Analyses History"])

def format_analysis_response(analysis: Analysis) -> AnalysisResponse:
    auth_resp = None
    if analysis.authenticity_result:
        auth_resp = AuthenticityResponse(
            id=analysis.authenticity_result.id,
            model_name=analysis.authenticity_result.model_name,
            model_version=analysis.authenticity_result.model_version,
            estimated_risk_score=analysis.authenticity_result.estimated_risk_score,
            result_summary=analysis.authenticity_result.result_summary,
            limitations=analysis.authenticity_result.limitations,
            acoustic_metrics=analysis.authenticity_result.acoustic_metrics or {},
            created_at=analysis.authenticity_result.created_at
        )

    return AnalysisResponse(
        id=analysis.id,
        user_id=analysis.user_id,
        original_filename=analysis.original_filename,
        audio_duration_seconds=analysis.audio_duration_seconds,
        detected_language=analysis.detected_language,
        transcript=analysis.transcript,
        transcript_source=analysis.transcript_source,
        scam_risk_score=analysis.scam_risk_score,
        scam_risk_category=analysis.scam_risk_category,
        detected_indicators=analysis.detected_indicators or [],
        evidence_excerpts=analysis.evidence_excerpts or [],
        recommended_actions=analysis.recommended_actions or [],
        transcription_model=analysis.transcription_model,
        detection_method_version=analysis.detection_method_version,
        processing_status=analysis.processing_status,
        retained_audio_path=analysis.retained_audio_path,
        authenticity=auth_resp,
        created_at=analysis.created_at
    )

@router.get("/stats/dashboard", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculates cybersecurity metrics and summary distribution for dashboard."""
    user_analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(desc(Analysis.created_at)).all()
    
    total = len(user_analyses)
    category_counts = {
        "Critical Risk": 0,
        "High Risk": 0,
        "Medium Risk": 0,
        "Low Risk": 0
    }
    indicator_frequency = {}
    timeline = []

    success_count = sum(1 for a in user_analyses if a.processing_status == "completed")
    failure_count = sum(1 for a in user_analyses if a.processing_status == "failed")

    for a in user_analyses:
        cat = a.scam_risk_category
        if cat in category_counts:
            category_counts[cat] += 1

        for ind in (a.detected_indicators or []):
            name = ind.get("name", "Unknown")
            indicator_frequency[name] = indicator_frequency.get(name, 0) + 1

        # Add to timeline
        timeline.append({
            "date": a.created_at.strftime("%Y-%m-%d %H:%M"),
            "score": a.scam_risk_score,
            "category": a.scam_risk_category,
            "filename": a.original_filename
        })

    # Sort top indicators
    top_indicators = [
        {"name": k, "count": v}
        for k, v in sorted(indicator_frequency.items(), key=lambda item: item[1], reverse=True)[:6]
    ]

    recent_items = [format_analysis_response(a) for a in user_analyses[:5]]

    return DashboardStatsResponse(
        total_analyses=total,
        category_counts=category_counts,
        top_indicators=top_indicators,
        recent_analyses=recent_items,
        success_count=success_count,
        failure_count=failure_count,
        timeline=list(reversed(timeline[-10:]))
    )

@router.get("", response_model=AnalysesListResponse)
def list_analyses(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns paginated analysis history for authenticated user."""
    query = db.query(Analysis).filter(Analysis.user_id == current_user.id)

    if category:
        query = query.filter(Analysis.scam_risk_category == category)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Analysis.original_filename.ilike(search_pattern)) |
            (Analysis.transcript.ilike(search_pattern))
        )

    total = query.count()
    offset = (page - 1) * page_size
    analyses = query.order_by(desc(Analysis.created_at)).offset(offset).limit(page_size).all()
    total_pages = max(1, (total + page_size - 1) // page_size)

    return AnalysesListResponse(
        items=[format_analysis_response(a) for a in analyses],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_by_id(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves single analysis owned by current user."""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found or access denied."
        )

    return format_analysis_response(analysis)

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes an analysis report and handles associated retained audio."""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found or access denied."
        )

    # Clean up retained audio file if exists
    if analysis.retained_audio_path:
        cleanup_file(analysis.retained_audio_path)

    db.delete(analysis)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_all_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes all analyses belonging to current user."""
    user_analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).all()
    for a in user_analyses:
        if a.retained_audio_path:
            cleanup_file(a.retained_audio_path)
        db.delete(a)

    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{analysis_id}/pdf")
def export_analysis_pdf(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generates and downloads official incident report in PDF format."""
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found."
        )

    analysis_data = format_analysis_response(analysis).model_dump()
    pdf_bytes = generate_pdf_report(analysis_data)

    return Response(
        content=bytes(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=voiceshield_report_{analysis.id[:8]}.pdf"
        }
    )
