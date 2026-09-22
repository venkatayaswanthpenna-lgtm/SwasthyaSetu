from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    
    # Links back to User
    user = relationship("User", backref="worker_profile")

class WorkerCredential(Base):
    __tablename__ = "worker_credentials"

    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("worker_profiles.id"))
    credential_type = Column(String) # e.g., ASHA_ID, NUID, HPR_ID
    credential_number_encrypted = Column(String) # Store encrypted as per PRD
    issuer = Column(String)
    verification_source = Column(String)
    verification_status = Column(String) # UNVERIFIED, VERIFICATION_PENDING, VERIFIED, REJECTED
    issued_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True) # Admin who verified manually
    verification_reference = Column(String, nullable=True)
    last_checked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class CredentialVerification(Base):
    __tablename__ = "credential_verifications"

    id = Column(Integer, primary_key=True, index=True)
    credential_id = Column(Integer, ForeignKey("worker_credentials.id"))
    status = Column(String) # PENDING, APPROVED, REJECTED
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
