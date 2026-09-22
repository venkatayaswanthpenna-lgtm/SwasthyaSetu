from pydantic import BaseModel
from typing import Optional, Dict, Any

class VerificationStartRequest(BaseModel):
    role: str
    credential_type: str
    credential_id: str
    mobile_number: str
    additional_info: Optional[Dict[str, Any]] = None

class VerificationResponse(BaseModel):
    status: str
    message: str
    reference_id: Optional[str] = None
    is_demo: bool = True
