from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/memory",
    tags=["memory"],
    dependencies=[Depends(auth.get_current_user)], # Add authentication dependency
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.Memory])
def read_memories(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """
    Retrieve a list of memory configurations.
    """
    memories = db.query(models.Memory).offset(skip).limit(limit).all()
    return memories

@router.get("/{memory_id}", response_model=schemas.Memory)
def read_memory(memory_id: int, db: Session = Depends(database.get_db)):
    """
    Retrieve a specific memory configuration by ID.
    """
    memory = db.query(models.Memory).filter(models.Memory.id == memory_id).first()
    if memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")
    return memory

@router.post("/", response_model=schemas.Memory, status_code=status.HTTP_201_CREATED)
def create_memory(memory: schemas.MemoryCreate, db: Session = Depends(database.get_db)):
    """
    Create a new memory configuration.
    """
    db_memory = models.Memory(**memory.model_dump())
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)
    return db_memory

@router.put("/{memory_id}", response_model=schemas.Memory)
def update_memory(memory_id: int, memory: schemas.MemoryUpdate, db: Session = Depends(database.get_db)) -> schemas.Memory:
    """
    Update an existing memory configuration.
    """
    db_memory = db.query(models.Memory).filter(models.Memory.id == memory_id).first()
    if db_memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")

    for key, value in memory.model_dump(exclude_unset=True).items():
        setattr(db_memory, key, value)

    db.commit()
    db.refresh(db_memory)
    return db_memory

@router.delete("/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memory(memory_id: int, db: Session = Depends(database.get_db)):
    """
    Delete a memory configuration by ID.
    """
    db_memory = db.query(models.Memory).filter(models.Memory.id == memory_id).first()
    if db_memory is None:
        raise HTTPException(status_code=404, detail="Memory not found")

    db.delete(db_memory)
    db.commit()
    return {"ok": True}