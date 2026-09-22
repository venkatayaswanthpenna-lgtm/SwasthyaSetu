from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    care_episode_id = Column(Integer, ForeignKey("care_episodes.id"))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    provider_id = Column(Integer, ForeignKey("worker_profiles.id"), nullable=True)
    
    service_type = Column(String)
    appointment_date = Column(Date)
    appointment_time = Column(Time, nullable=True)
    
    status = Column(String, default="SCHEDULED") # SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED, NO_SHOW
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
