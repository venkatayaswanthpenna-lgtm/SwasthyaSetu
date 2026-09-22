from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class DiagnosticRequest(Base):
    __tablename__ = "diagnostic_requests"

    id = Column(Integer, primary_key=True, index=True)
    care_episode_id = Column(Integer, ForeignKey("care_episodes.id"))
    patient_id = Column(Integer, ForeignKey("patients.id"))
    requesting_facility_id = Column(Integer, ForeignKey("facilities.id"))
    testing_facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    
    test_name = Column(String)
    status = Column(String, default="REQUESTED") # REQUESTED, SCHEDULED, SAMPLE_COLLECTED, IN_PROGRESS, RESULT_AVAILABLE, CANCELLED
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class DiagnosticResult(Base):
    __tablename__ = "diagnostic_results"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("diagnostic_requests.id"), unique=True)
    result_data = Column(JSON) # Store flexible result data
    verified_by_worker_id = Column(Integer, ForeignKey("worker_profiles.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
