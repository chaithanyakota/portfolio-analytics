from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, StringConstraints
from typing import Literal, Optional
from uuid import UUID

from typing_extensions import Annotated

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
    
Symbol = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        to_upper=True,
        min_length=1,
        max_length=10,
        pattern=r"^[A-Z.\-]+$",
    ),
]

class PortfolioCreate(BaseModel):
    name: Annotated[
        str,
        StringConstraints(min_length=1, max_length=60, strip_whitespace=True),
    ]
    
class TransactionCreate(BaseModel):
    portfolio_id: UUID
    symbol: Symbol
    quantity: float = Field(..., gt=0, le=1_000_000)
    price: float = Field(..., gt=0, le=10_000_000)
    side: Literal["buy", "sell"]
    timestamp: Optional[datetime] = None # Optional; default server time if not provided
