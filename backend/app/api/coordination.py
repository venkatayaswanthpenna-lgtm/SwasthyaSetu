from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.coordination import ReferralCreate, ReferralResponse, AppointmentCreate, AppointmentResponse
from app.models.referral import Referral
from app.models.appointment import Appointment
from app.models.facility import Facility, FacilityCapability
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/referrals", response_model=ReferralResponse)
def create_referral(
    referral_in: ReferralCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # In reality, fetch worker_profile_id from current_user
    db_referral = Referral(
        care_episode_id=referral_in.care_episode_id,
        patient_id=referral_in.patient_id,
        source_facility_id=referral_in.source_facility_id,
        destination_facility_id=referral_in.destination_facility_id,
        reason=referral_in.reason,
        required_service=referral_in.required_service
    )
    db.add(db_referral)
    db.commit()
    db.refresh(db_referral)
    return db_referral

@router.get("/facilities/match")
def match_facilities(
    service_type: str,
    district_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Service Capability Matching Engine
    """
    query = db.query(Facility).join(FacilityCapability).filter(
        FacilityCapability.service_type == service_type,
        FacilityCapability.is_available == True
    )
    
    if district_id:
        query = query.filter(Facility.district_id == district_id)
        
    facilities = query.all()
    return [{"id": f.id, "name": f.name, "type": f.facility_type} for f in facilities]

@router.post("/appointments", response_model=AppointmentResponse)
def create_appointment(
    appointment_in: AppointmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_appointment = Appointment(
        care_episode_id=appointment_in.care_episode_id,
        patient_id=appointment_in.patient_id,
        facility_id=appointment_in.facility_id,
        service_type=appointment_in.service_type,
        appointment_date=appointment_in.appointment_date,
        appointment_time=appointment_in.appointment_time
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment
