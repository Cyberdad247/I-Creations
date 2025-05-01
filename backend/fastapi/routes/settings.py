from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/settings",
    tags=["settings"],
    dependencies=[Depends(auth.get_current_user)], # Add authentication dependency
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.Settings])
def read_settings(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """
    Retrieve a list of settings configurations.
    """
    settings = db.query(models.Settings).offset(skip).limit(limit).all()
    return settings

@router.get("/{settings_id}", response_model=schemas.Settings)
def read_setting(settings_id: int, db: Session = Depends(database.get_db)):
    """
    Retrieve a specific settings configuration by ID.
    """
    setting = db.query(models.Settings).filter(models.Settings.id == settings_id).first()
    if setting is None:
        raise HTTPException(status_code=404, detail="Settings not found")
    return setting

@router.post("/", response_model=schemas.Settings, status_code=status.HTTP_201_CREATED)
def create_setting(setting: schemas.SettingsCreate, db: Session = Depends(database.get_db)):
    """
    Create a new settings configuration.
    """
    db_setting = models.Settings(**setting.model_dump())
    db.add(db_setting)
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.put("/{settings_id}", response_model=schemas.Settings)
def update_setting(settings_id: int, setting: schemas.SettingsUpdate, db: Session = Depends(database.get_db)):
    """
    Update an existing settings configuration.
    """
    db_setting = db.query(models.Settings).filter(models.Settings.id == settings_id).first()
    if db_setting is None:
        raise HTTPException(status_code=404, detail="Settings not found")

    for key, value in setting.model_dump(exclude_unset=True).items():
        setattr(db_setting, key, value)

    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.delete("/{settings_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_setting(settings_id: int, db: Session = Depends(database.get_db)):
    """
    Delete a settings configuration by ID.
    """
    db_setting = db.query(models.Settings).filter(models.Settings.id == settings_id).first()
    if db_setting is None:
        raise HTTPException(status_code=404, detail="Settings not found")

    db.delete(db_setting)
    db.commit()
    return {"ok": True}