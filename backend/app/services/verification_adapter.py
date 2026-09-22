import uuid
from typing import Dict, Any

class BaseVerificationAdapter:
    def verify(self, credential_id: str, additional_info: Dict[str, Any] = None) -> Dict[str, Any]:
        raise NotImplementedError("Subclasses must implement this method")

class MockHPRAdapter(BaseVerificationAdapter):
    """Mock adapter for Healthcare Professionals Registry (HPR)"""
    def verify(self, credential_id: str, additional_info: Dict[str, Any] = None) -> Dict[str, Any]:
        # Simulate an API call
        if credential_id.startswith("HPR-"):
            return {
                "status": "VERIFIED",
                "source": "HPR_MOCK_API",
                "reference": str(uuid.uuid4()),
                "message": "DEMO ONLY: Simulated successful verification"
            }
        return {
            "status": "REJECTED",
            "source": "HPR_MOCK_API",
            "reference": None,
            "message": "Invalid HPR ID format"
        }

class MockASHASoftAdapter(BaseVerificationAdapter):
    """Mock adapter for ASHA Soft"""
    def verify(self, credential_id: str, additional_info: Dict[str, Any] = None) -> Dict[str, Any]:
        if len(credential_id) > 5:
            return {
                "status": "VERIFIED",
                "source": "ASHA_SOFT_MOCK_API",
                "reference": str(uuid.uuid4()),
                "message": "DEMO ONLY: Simulated successful verification"
            }
        return {
            "status": "REJECTED",
            "source": "ASHA_SOFT_MOCK_API",
            "reference": None,
            "message": "ASHA ID not found"
        }

class VerificationServiceFactory:
    @staticmethod
    def get_adapter(credential_type: str) -> BaseVerificationAdapter:
        adapters = {
            "HPR_ID": MockHPRAdapter(),
            "ASHA_ID": MockASHASoftAdapter(),
            # Add NUID, etc.
        }
        return adapters.get(credential_type, MockHPRAdapter()) # Default fallback for demo
