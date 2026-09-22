from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import date, time, datetime

class ReferralBase(BaseModel):
    care_episode_id: int
    patient_id: int
    source_facility_id: int
    destination_facility_id: int
    reason: str
    required_service: str

class ReferralCreate(ReferralBase):
    pass

class ReferralResponse(ReferralBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    care_episode_id: int
    patient_id: int
    facility_id: int
    service_type: str
    appointment_date: date
    appointment_time: Optional[time] = None

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentResponse(AppointmentBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class DiagnosticRequestBase(BaseModel):
    care_episode_id: int
    patient_id: int
    requesting_facility_id: int
    test_name: str

class DiagnosticRequestCreate(DiagnosticRequestBase):
    pass

class DiagnosticRequestResponse(DiagnosticRequestBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
