import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

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