from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class CareStepBase(BaseModel):
    sequence: int
    action_type: str
    status: str
    due_date: Optional[date] = None
    notes: Optional[str] = None

class CareStepResponse(CareStepBase):
    id: int
    completion_date: Optional[datetime] = None
    responsible_facility_id: Optional[int] = None
    responsible_worker_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class CareEpisodeBase(BaseModel):
    patient_id: int
    patient_need: str
    care_requirement: str
    priority: str = "NORMAL"
    assigned_facility_id: Optional[int] = None
    assigned_worker_id: Optional[int] = None

class CareEpisodeCreate(CareEpisodeBase):
    # Optional: Initial steps can be provided during creation
    initial_steps: Optional[List[CareStepBase]] = None

class CareEpisodeResponse(CareEpisodeBase):
    id: int
    episode_id: str
    current_status: str
    created_at: datetime
    steps: List[CareStepResponse] = []

    class Config:
        from_attributes = True
