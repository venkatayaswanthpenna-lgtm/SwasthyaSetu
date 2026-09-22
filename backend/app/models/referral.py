from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    care_episode_id = Column(Integer, ForeignKey("care_episodes.id"))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    
    source_facility_id = Column(Integer, ForeignKey("facilities.id"))
    destination_facility_id = Column(Integer, ForeignKey("facilities.id"))
    referred_by_worker_id = Column(Integer, ForeignKey("worker_profiles.id"))
    
    reason = Column(String)
    required_service = Column(String)
    status = Column(String, default="PENDING") # PENDING, ACCEPTED, SCHEDULED, IN_PROGRESS, COMPLETED, DELAYED, ESCALATED, CANCELLED
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
