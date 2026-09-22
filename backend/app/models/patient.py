from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String)
    mobile_number = Column(String, index=True, nullable=True)
    abha_id = Column(String, unique=True, index=True, nullable=True) # Ayushman Bharat Health Account
    address_line_1 = Column(String, nullable=True)
    village_town = Column(String, index=True, nullable=True)
    district_id = Column(Integer, nullable=True) # Linking to District model logic
    
    # Relationships
    care_episodes = relationship("CareEpisode", back_populates="patient")
