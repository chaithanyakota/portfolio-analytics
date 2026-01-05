from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Portfolio, User

router = APIRouter(prefix="/portfolios", tags=["portfolios"])

@router.post("")
def create_porfolio(
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
): 
    name = body.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Portfolio name is required")
    p = Portfolio(user_id = user.id, name=name)
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"id": str(p.id), "name": p.name}

@router.get("")
def list_portfolios(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == user.id).all()
    return [{"id": str(p.id), "name": p.name} for p in portfolios]

@router.delete("/{portfolio_id}")
def delete_portfolio(
    portfolio_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id, Portfolio.user_id == user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    db.delete(portfolio)
    db.commit()
    return {"status": "Portfolio deleted"}