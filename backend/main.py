import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional, List, Annotated
from datetime import datetime
from database import SessionLocal, engine
from hashlib import sha256

import models

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware( # add protection against CORS
    CORSMiddleware,
    allow_origins=origins, # allow specific origins
)

# ------ User Models ------
class UserBase(BaseModel):
    name: str
    email: str
    role: Optional[str] = "volunteer"
    password: str

class UserModel(BaseModel):
    id: int
    name: str
    email: str
    role: str
    
    class Config:
        orm_mode = True

# ----- Shift Models -----

class ShiftBase(BaseModel):
    id: int
    user_id: int
    task: str
    start_time: str
    end_time: Optional[str] = None
    approved: bool = False

    class Config:
        orm_mode = True

class ShiftCreate(BaseModel):
    user_id: int
    task: str
    start_time: Optional[str] = None

class ShiftStop(BaseModel):
    shift_id: int
    end_time: Optional[str] = None

# ------ Token Model ------

class TokenTransaction(BaseModel):
    id: int
    user_id: int
    shift_id: Optional[int] = None
    type: str # "earn" or "spend"
    amount: float
    created_at: datetime

    class Config:
        orm_mode = True

class TokenCreate(BaseModel):
    user_id: int
    shift_id: Optional[int] = None
    type: str
    amount: float



# Dependency function for FastAPI routes

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() # when request is complete 

def hash_password(pw: str) -> str:
    return sha256(pw.encode("utf-8")).hexdigest() 


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine) # database to create tables

# endpoint to create a new user
@app.post("/users/", response_model=UserModel, status_code=201)
async def create_user(user: UserBase, db: db_dependency):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")

    # map all vars from User base to User table in SQL database

    db_user = models.User(
        name=user.name,
        email=user.email,
        role=user.role,
        password_hash=hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[UserModel])
async def read_users(db: db_dependency, skip: int = 0, limit: int = 100): # query params to fetch certain number of users
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users