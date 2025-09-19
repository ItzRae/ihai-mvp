from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

# ------ User Models ------
class UserBase(BaseModel):
    name: str
    role: str = "volunteer"  # default role
    email: str

class UserCreate(UserBase): # avoids sending password hash back to client
    password: str
    model_config = ConfigDict(from_attributes=True)  # Pydantic v2 replacement for orm_mode


class User(UserBase): 
    id: int

    model_config = ConfigDict(from_attributes=True) 
  

# ----- Shift Models -----

class ShiftBase(BaseModel): # sending only these fields when creating a shift
    task: str
    host_site: Optional[str] = ""
    # default is current time; can be overridden if needed
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

       

    model_config = ConfigDict(from_attributes=True) 


class ShiftCreate(ShiftBase):
    pass

class Shift(ShiftBase):
    id: int
    approved: bool = False
    user_id: int # once created, we can see which user it belongs to
    date_created: datetime
    date_last_modified: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True) 


# ------ Token Model ------

class TokenTransaction(BaseModel):
    id: int
    user_id: int
    shift_id: Optional[int] = None
    type: str # "earn" or "spend"
    amount: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True) 


class TokenCreate(BaseModel):
    user_id: int
    shift_id: Optional[int] = None
    type: str
    amount: float

