from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Portfolio, Transaction, User
from app.analytics.holdings import compute_holdings

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/portfolios/{portfolio_id}/holdings")
def get_holdings(
    portfolio_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
): 
    p = (
        db.query(Portfolio)
        .filter(Portfolio.id == portfolio_id, Portfolio.user_id == user.id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail="portfolio not found")

    transactions = (
        db.query(Transaction)
        .filter(Transaction.portfolio_id == portfolio_id)
        .all()
    )

    return compute_holdings(transactions)