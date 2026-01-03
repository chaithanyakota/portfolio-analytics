import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# fail if DATABASE_URL is not set
DATABASE_PUBLIC_URL = os.getenv("DATABASE_PUBLIC_URL")


if not DATABASE_PUBLIC_URL:
    raise ValueError("DATABASE_PUBLIC_URL is not set")

# pool_pre_ping helps avoid stale connections.
engine = create_engine(DATABASE_PUBLIC_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
