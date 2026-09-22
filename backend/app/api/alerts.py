from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.delay_detector import DelayDetector
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/trigger-delay-scan")
def trigger_delay_scan(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Manually trigger the delay detection cron job.
    In production, this would be run by a scheduler (e.g., Celery/Redis).
    """
    # Normally check if user is System Admin
    delays_found = DelayDetector.detect_and_escalate_delays(db)
    return {"message": "Delay scan complete", "delays_detected": delays_found}

@router.get("/escalations")
def get_escalations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get active escalations for the user's role.
    """
    from app.models.follow_up import Escalation
    # Mocking RBAC filter for demo
    escalations = db.query(Escalation).filter(Escalation.status == "ACTIVE").all()
    return escalations
