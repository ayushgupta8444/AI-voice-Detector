from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, UserSettings
from app.schemas.schemas import UserSettingsResponse, UserSettingsUpdate
from app.utils.security import get_current_user

router = APIRouter(prefix="/settings", tags=["User Settings & Privacy"])

@router.get("", response_model=UserSettingsResponse)
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns privacy and retention settings for authenticated user."""
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(
            user_id=current_user.id,
            audio_retention_enabled=False,
            audio_retention_duration=7
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return UserSettingsResponse.model_validate(settings)

@router.patch("", response_model=UserSettingsResponse)
def update_user_settings(
    update_data: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates audio retention preferences and privacy duration."""
    settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings:
        settings = UserSettings(user_id=current_user.id)
        db.add(settings)

    if update_data.audio_retention_enabled is not None:
        settings.audio_retention_enabled = update_data.audio_retention_enabled

    if update_data.audio_retention_duration is not None:
        settings.audio_retention_duration = update_data.audio_retention_duration

    settings.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(settings)

    return UserSettingsResponse.model_validate(settings)
