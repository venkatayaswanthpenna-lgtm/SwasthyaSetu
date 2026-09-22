import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.care import CareEpisodeCreate, CareEpisodeResponse
from app.models.care import CareEpisode, CareStep
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=CareEpisodeResponse)
def create_care_episode(
    episode_in: CareEpisodeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new Care Episode. 
    Connects the patient's need to an executable Care Pathway.
    """
    # Generate a unique episode ID (e.g. CE-<YYYY>-<UUID_PREFIX>)
    new_episode_id = f"CE-2024-{str(uuid.uuid4())[:8].upper()}"
    
    db_episode = CareEpisode(
        episode_id=new_episode_id,
        patient_id=episode_in.patient_id,
        patient_need=episode_in.patient_need,
        care_requirement=episode_in.care_requirement,
        priority=episode_in.priority,
        assigned_facility_id=episode_in.assigned_facility_id,
        assigned_worker_id=episode_in.assigned_worker_id
    )
    db.add(db_episode)
    db.commit()
    db.refresh(db_episode)
    
    # If initial steps are provided (via a pathway template), create them
    if episode_in.initial_steps:
        for step in episode_in.initial_steps:
            db_step = CareStep(
                episode_id=db_episode.id,
                sequence=step.sequence,
                action_type=step.action_type,
                status=step.status,
                due_date=step.due_date,
                notes=step.notes,
                responsible_facility_id=episode_in.assigned_facility_id,
                responsible_worker_id=episode_in.assigned_worker_id
            )
            db.add(db_step)
        db.commit()
        db.refresh(db_episode)
        
    return db_episode

@router.get("/", response_model=List[CareEpisodeResponse])
def get_care_episodes(
    skip: int = 0, limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve care episodes based on RBAC (simplified to get all for now).
    """
    episodes = db.query(CareEpisode).offset(skip).limit(limit).all()
    return episodes

@router.get("/{episode_id}", response_model=CareEpisodeResponse)
def get_care_episode(
    episode_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific care episode and its complete timeline/steps.
    """
    episode = db.query(CareEpisode).filter(CareEpisode.episode_id == episode_id).first()
    if not episode:
        raise HTTPException(status_code=404, detail="Care Episode not found")
    return episode
