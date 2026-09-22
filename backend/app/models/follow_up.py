from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class FollowUp(Base):
    __tablename__ = "follow_ups"

    id = Column(Integer, primary_key=True, index=True)
    care_episode_id = Column(Integer, ForeignKey("care_episodes.id"))
    care_step_id = Column(Integer, ForeignKey("care_steps.id"), nullable=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    assigned_worker_id = Column(Integer, ForeignKey("worker_profiles.id"))
    
    due_date = Column(Date)
    status = Column(String, default="PENDING") # PENDING, COMPLETED, MISSED, ESCALATED
    notes = Column(String, nullable=True)
    
    completion_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Escalation(Base):
    __tablename__ = "escalations"

    id = Column(Integer, primary_key=True, index=True)
    care_episode_id = Column(Integer, ForeignKey("care_episodes.id"))
    escalation_reason = Column(String) # E.g., DELAYED_CARE, MISSED_FOLLOWUP, UNRESOLVED_REFERRAL
    escalated_from_worker_id = Column(Integer, ForeignKey("worker_profiles.id"), nullable=True)
    escalated_to_role = Column(String) # e.g., CHO, MEDICAL_OFFICER, DISTRICT_ADMIN
    
    status = Column(String, default="ACTIVE") # ACTIVE, RESOLVED
    resolution_notes = Column(String, nullable=True)
    
    resolved_by_worker_id = Column(Integer, ForeignKey("worker_profiles.id"), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
