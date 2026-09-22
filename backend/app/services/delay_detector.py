from datetime import date
from sqlalchemy.orm import Session
from app.models.care import CareStep, CareEpisode
from app.models.follow_up import Escalation

class DelayDetector:
    @staticmethod
    def detect_and_escalate_delays(db: Session):
        """
        Scan for overdue care steps that aren't completed.
        If delayed, update status to DELAYED and optionally create an escalation.
        """
        today = date.today()
        
        # Find overdue steps
        overdue_steps = db.query(CareStep).filter(
            CareStep.due_date < today,
            CareStep.status.notin_(["COMPLETED", "CANCELLED", "DELAYED", "ESCALATED"])
        ).all()
        
        for step in overdue_steps:
            step.status = "DELAYED"
            
            # Also mark the Episode as DELAYED
            episode = db.query(CareEpisode).filter(CareEpisode.id == step.episode_id).first()
            if episode and episode.current_status != "DELAYED":
                episode.current_status = "DELAYED"
            
            # Auto-escalate if it's a critical step
            if step.action_type in ["TREATMENT", "REFERRAL"]:
                step.status = "ESCALATED"
                escalation = Escalation(
                    care_episode_id=step.episode_id,
                    escalation_reason=f"DELAYED_CARE_STEP_{step.action_type}",
                    escalated_to_role="MEDICAL_OFFICER" # Route to higher authority
                )
                db.add(escalation)
                
        db.commit()
        return len(overdue_steps)
