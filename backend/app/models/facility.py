from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    facility_type = Column(String) # e.g., PHC, CHC, SC, District Hospital
    district_id = Column(Integer, ForeignKey("districts.id"))
    block_id = Column(Integer, ForeignKey("blocks.id"))
    location_details = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

class FacilityCapability(Base):
    __tablename__ = "facility_capabilities"

    id = Column(Integer, primary_key=True, index=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    service_type = Column(String) # e.g., Diagnostic, Treatment, Referral
    service_details = Column(JSON, nullable=True)
    is_available = Column(Boolean, default=True)
