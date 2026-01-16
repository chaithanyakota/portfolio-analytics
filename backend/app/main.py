from fastapi import FastAPI, Depends
from .database import Base, engine
from . import models # noqa: F401
from .auth import router as auth_router
from .deps import get_current_user
from .models import User
from .portfolios.router import router as portfolios_router
from .transactions.router import router as transactions_router
from app.analytics.router import router as analytics_router

from fastapi.middleware.cors import CORSMiddleware




app = FastAPI(title="Portfolio Analytics API") # create FastAPI app instance

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://portfolio-analytics-production-5caa.up.railway.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(portfolios_router)
app.include_router(transactions_router)
app.include_router(analytics_router)

@app.get("/") # register a REST endpoint
def root(): 
    return {"message": "portfolio-analytics API running"}

@app.get("/health") # register a health check endpoint
def health():
    return {"status": "ok"}

@app.get("/me")
def me(user: User = Depends(get_current_user)):
    return {"id": str(user.id), "email": user.email}

