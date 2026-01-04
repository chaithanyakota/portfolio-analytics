from fastapi import FastAPI, Depends
from .database import Base, engine
from . import models # noqa: F401
from .auth import router as auth_router
from .deps import get_current_user
from .models import User


app = FastAPI(title="Portfolio Analytics API") # create FastAPI app instance

@app.get("/") # register a REST endpoint
def root(): 
    return {"message": "portfolio-analytics API running"}

app.include_router(auth_router)

@app.get("/health") # register a health check endpoint
def health():
    return {"status": "ok"}

@app.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": str(user.id), "email": user.email}

