import schemas 
import uvicorn
import jwt
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List, Annotated
from datetime import datetime
from database import SessionLocal, engine
from passlib.hash import bcrypt
import models
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

JWT_SECRET = "abc12345"

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


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine) # database to create tables

# endpoint to create a new user
@app.post("/users/", response_model=schemas.User, status_code=201)
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
    return user_obj



@app.get("/users/", response_model=List[schemas.User])
async def read_users(db: db_dependency, skip: int = 0, limit: int = 100): # query params to fetch certain number of users
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@app.post("/authtoken")
async def generate_authtoken(db: db_dependency, form_data: OAuth2PasswordRequestForm = Depends(), ):
    user = await authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    return await create_access_token(user)
