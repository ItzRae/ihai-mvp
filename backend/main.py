import schemas 
import uvicorn
import jwt
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List, Annotated
from datetime import datetime, timezone
from database import SessionLocal, engine
from passlib.hash import bcrypt
import models
import fastapi.security
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

JWT_SECRET = "abc12345"
oauth2schema = fastapi.security.OAuth2PasswordBearer(tokenUrl="/api/authtoken/") # tokenUrl is the endpoint to get the token

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173"
]

app.add_middleware( # add protection against CORS
    CORSMiddleware,
    allow_origins=origins, # allow specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- helper funcs -------

# Dependency function for FastAPI routes

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() # when request is complete 


async def get_user_by_email(email: str, db: Session):
    return db.query(models.User).filter(models.User.email == email).first()    

async def authenticate_user(email: str, password: str, db: Session):
    user = await get_user_by_email(email=email, db=db)
    if not user:
        return False
    
    if not user.verify_password(password):
        return False
    
    return user

async def create_access_token(user: models.User):
    user_obj = schemas.User.from_orm(user)

    authtoken = jwt.encode(user_obj.dict(), JWT_SECRET, algorithm="HS256")

    return dict(access_token=authtoken, token_type="bearer")


async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2schema)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"]) # decode token to get user data
        user = db.query(models.User).get(payload["id"]) # get user from db using id in token payload
    except:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return schemas.User.from_orm(user)

async def _create_shift(user: models.User, 
                       shift: schemas.ShiftCreate, 
                       db: Session):
    shift = models.Shift(**shift.model_dump(), 
                         user_id=user.id) # unpack all fields from shift and add user_id
    db.add(shift)
    db.commit()
    db.refresh(shift)
    return schemas.Shift.from_orm(shift) # return shift as Pydantic model

async def shift_selector(shift_id: int, db: Session, user: models.User):
    shift = (
        db.query(models.Shift)
        .filter_by(user_id=user.id) # ensure user can only access their own shifts
        .filter(models.Shift.id == shift_id)
        .first()
    )
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    return shift

async def _get_shift(shift_id: int, db: Session, user: models.User):
    shift = await shift_selector(shift_id, db, user)
    return schemas.Shift.from_orm(shift)

async def _delete_shift(shift_id: int, db: Session, user: models.User):
    shift = await shift_selector(shift_id, db, user)
    db.delete(shift)
    db.commit()

async def _update_shift(shift_id: int, 
                        shift_data: schemas.ShiftCreate,
                        db: Session, 
                        user: models.User):
    shift_db = await shift_selector(shift_id, db, user)
    
    shift_db.task = shift_data.task
    shift_db.host_site = shift_data.host_site
    shift_db.start_time = shift_data.start_time
    shift_db.end_time = shift_data.end_time
    shift_db.date_last_modified = datetime.now(timezone.utc) # update last modified time

    db.commit()
    db.refresh(shift_db)
    return schemas.Shift.from_orm(shift_db)

# ----- endpoints --------

db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine) # database to create tables

# endpoint to create a new user
@app.post("/api/users/", status_code=201)
async def create_user(user: schemas.UserCreate, db: db_dependency):
    
    db_user = await get_user_by_email(user.email, db)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_obj = models.User(     # map all vars from User base to User table in SQL database
        name=user.name,
        email=user.email,
        role=user.role,
        password_hash=bcrypt.hash(user.password) # hash password for storage
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    return await create_access_token(user_obj) # return token instead of user details

@app.get("/api/users/", response_model=List[schemas.User])
async def read_users(db: db_dependency, skip: int = 0, limit: int = 100): # query params to fetch certain number of users
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users
    

@app.post("/api/authtoken/")
async def generate_authtoken(db: db_dependency, form_data: OAuth2PasswordRequestForm = Depends(), ):
    user = await authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return await create_access_token(user)

@app.get("/api/users/me", response_model=schemas.User)
async def get_user(user: models.User = Depends(get_current_user)):
    return user

# ------ shifts -----
@app.post("/api/shifts/", response_model=schemas.Shift, status_code=201)
async def create_shift(shift: schemas.ShiftCreate, 
                       db: db_dependency, 
                       current_user: models.User = Depends(get_current_user)):
    return await _create_shift(current_user, shift, db) 
    
@app.get("/api/shifts/{shift_id}", response_model=schemas.Shift)
async def get_shift(shift_id: int, 
                    db: db_dependency, 
                    current_user: models.User = Depends(get_current_user)):
    return await _get_shift(shift_id, db, current_user)

@app.delete("/api/shifts/{shift_id}", status_code=200)
async def delete_shift(shift_id: int, 
                       db: db_dependency, 
                       current_user: models.User = Depends(get_current_user)):
    await _delete_shift(shift_id, db, current_user)
    return {"message": "Shift deleted successfully"}

@app.put("/api/shifts/{shift_id}", status_code=200)
async def update_shift(shift_id: int, 
                       shift: schemas.ShiftCreate,
                       db: db_dependency, 
                       current_user: models.User = Depends(get_current_user)):
    await _update_shift(shift_id, shift, db, current_user)
    return {"message": "Shift updated successfully"}
