from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.verification import VerificationStartRequest, VerificationResponse
from app.services.verification_adapter import VerificationServiceFactory
from app.models.worker import WorkerCredential, WorkerProfile
from app.api.dependencies import get_current_user
from app.models.user import User
import uuid

router = APIRouter()

@router.post("/start", response_model=VerificationResponse)
def start_verification(request: VerificationStartRequest, db: Session = Depends(get_db)):
    """
    Initiate credential verification. 
    In a real app, this might trigger an OTP to the registered mobile.
    For MVP/Demo, it uses mock adapters.
    """
    adapter = VerificationServiceFactory.get_adapter(request.credential_type)
    result = adapter.verify(request.credential_id, request.additional_info)
    
    # Normally we would save this to the database, but since the user might not be registered yet,
    # we just return the result for the frontend to proceed to the next step.
    
    if result["status"] == "VERIFIED":
        return VerificationResponse(
            status="VERIFIED",
            message=result["message"],
            reference_id=result["reference"]
        )
    else:
        return VerificationResponse(
            status="REJECTED",
            message="Unable to verify the provided credentials.",
            reference_id=None
        )

@router.post("/submit")
def submit_verified_worker(
    request: VerificationStartRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    After successful verification, link the credential to the current authenticated user.
    """
    # Verify again or check reference ID (simplified for MVP)
    adapter = VerificationServiceFactory.get_adapter(request.credential_type)
    result = adapter.verify(request.credential_id)
    
    if result["status"] != "VERIFIED":
        raise HTTPException(status_code=400, detail="Credential verification failed.")

    # Create Worker Profile if not exists
    profile = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
    if not profile:
        profile = WorkerProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Create Credential Record
    # WARNING: credential_id should be encrypted in a real scenario
    cred = WorkerCredential(
        worker_id=profile.id,
        credential_type=request.credential_type,
        credential_number_encrypted=request.credential_id, # Mock: plain text for demo
        verification_source=result["source"],
        verification_status="VERIFIED",
        verification_reference=result["reference"]
    )
    db.add(cred)
    db.commit()
    
    return {"message": "Worker profile updated with verified credential."}
