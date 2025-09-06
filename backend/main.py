import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI()

# ------ User Models ------
class UserBase(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        orm_mode = True # compatibility with ORM objects for data validation

class UserCreate(UserBase):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

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

origins = [
    "http://localhost:3000",
]

app.add_middleware( # add protection against CORS
    CORSMiddleware,
    allow_origins=origins, # allow specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)