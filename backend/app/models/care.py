from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Date, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class CareEpisode(Base):
    __tablename__ = "care_episodes"

    id = Column(Integer, primary_key=True, index=True)
    episode_id = Column(String, unique=True, index=True) # e.g. CE-2023-1029-XXXX
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient_need = Column(String)
    care_requirement = Column(String)
    priority = Column(String, default="NORMAL") # HIGH, NORMAL, LOW
    current_status = Column(String, default="ACTIVE") # ACTIVE, COMPLETED, DELAYED, ESCALATED, UNRESOLVED
    assigned_facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    assigned_worker_id = Column(Integer, ForeignKey("worker_profiles.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    patient = relationship("Patient", back_populates="care_episodes")
    steps = relationship("CareStep", back_populates="episode", order_by="CareStep.sequence")

class CarePathway(Base):
    """Configurable sequence template of required care steps"""
    __tablename__ = "care_pathways"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    description = Column(String)
    steps_configuration = Column(JSON) # JSON defining the sequence: Consultation -> Diagnostic -> Treatment

class CareStep(Base):
    __tablename__ = "care_steps"

    id = Column(Integer, primary_key=True, index=True)
    episode_id = Column(Integer, ForeignKey("care_episodes.id"))
    sequence = Column(Integer) # Order in the pathway
    action_type = Column(String) # CONSULTATION, DIAGNOSTIC, REFERRAL, TREATMENT, FOLLOW_UP
    status = Column(String) # IDENTIFIED, PLANNED, SCHEDULED, IN_PROGRESS, COMPLETED, DELAYED, CANCELLED
    due_date = Column(Date, nullable=True)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    
    responsible_facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    responsible_worker_id = Column(Integer, ForeignKey("worker_profiles.id"), nullable=True)
    
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    episode = relationship("CareEpisode", back_populates="steps")
