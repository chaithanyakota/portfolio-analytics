from fastapi import FastAPI
from .database import Base, engine
from . import models

app = FastAPI(title="Portfolio Analytics API") # create FastAPI app instance

@app.get("/") # register a REST endpoint
def root(): 
    return {"message": "portfolio-analytics API running"}

Base.metadata.create_all(bind=engine)

@app.get("/health") # register a health check endpoint
def health():
    return {"status": "ok"}
