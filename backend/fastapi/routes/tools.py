from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database, auth

router = APIRouter(
    prefix="/tools",
    tags=["tools"],
    dependencies=[Depends(auth.get_current_user)], # Add authentication dependency
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[schemas.Tool])
def read_tools(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """
    Retrieve a list of tools.
    """
    tools = db.query(models.Tool).offset(skip).limit(limit).all()
    return tools

@router.get("/{tool_id}", response_model=schemas.Tool)
def read_tool(tool_id: int, db: Session = Depends(database.get_db)):
    """
    Retrieve a specific tool by ID.
    """
    tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")
    return tool

@router.post("/", response_model=schemas.Tool, status_code=status.HTTP_201_CREATED)
def create_tool(tool: schemas.ToolCreate, db: Session = Depends(database.get_db)):
    """
    Create a new tool.
    """
    db_tool = models.Tool(**tool.model_dump())
    db.add(db_tool)
    db.commit()
    db.refresh(db_tool)
    return db_tool

@router.put("/{tool_id}", response_model=schemas.Tool)
def update_tool(tool_id: int, tool: schemas.ToolUpdate, db: Session = Depends(database.get_db)) -> schemas.Tool:
    """
    Update an existing tool.
    """
    db_tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if db_tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")

    for key, value in tool.model_dump(exclude_unset=True).items():
        setattr(db_tool, key, value)

    db.commit()
    db.refresh(db_tool)
    return db_tool

@router.delete("/{tool_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tool(tool_id: int, db: Session = Depends(database.get_db)):
    """
    Delete a tool by ID.
    """
    db_tool = db.query(models.Tool).filter(models.Tool.id == tool_id).first()
    if db_tool is None:
        raise HTTPException(status_code=404, detail="Tool not found")

    db.delete(db_tool)
    db.commit()
    return {"ok": True}