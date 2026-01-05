from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Portfolio, Transaction, User

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("")
def create_transaction(
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    portfolio_id = body.get("portfolio_id")
    symbol = body.get("symbol")
    quantity = body.get("quantity")
    price = body.get("price")
    side = body.get("side")  # buy/sell

    if not all([portfolio_id, symbol, quantity, price, side]):
        raise HTTPException(status_code=400, detail="missing required fields")

    if side not in ["buy", "sell"]:
        raise HTTPException(status_code=400, detail="side must be buy or sell")

    # ensure portfolio belongs to user
    p = (
        db.query(Portfolio)
        .filter(Portfolio.id == portfolio_id, Portfolio.user_id == user.id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail="portfolio not found")

    t = Transaction(
        portfolio_id=p.id,
        symbol=symbol.upper(),
        quantity=float(quantity),
        price=float(price),
        side=side,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return {"id": str(t.id)}

@router.get("/portfolio/{portfolio_id}")
def list_transactions(
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
        .filter(Transaction.portfolio_id == p.id)
        .order_by(Transaction.timestamp.asc())
        .all()
    )
    return [
        {
            "id": str(t.id),
            "symbol": t.symbol,
            "quantity": t.quantity,
            "price": t.price,
            "side": t.side,
            "timestamp": t.timestamp.isoformat(),
        }
        for t in transactions
    ]

