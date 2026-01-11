from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Portfolio, Transaction, User
from app.analytics.holdings import compute_holdings

from app.market_data.service import get_quote


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

@router.get("/portfolios/{portfolio_id}/value")
def get_portfolio_value(
    portfolio_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # 1) verify ownership (security)
    p = (
        db.query(Portfolio)
        .filter(Portfolio.id == portfolio_id, Portfolio.user_id == user.id)
        .first()
    )
    if not p:
        raise HTTPException(status_code=404, detail="portfolio not found")

    # 2) load transactions (source of truth)
    txns = (
        db.query(Transaction)
        .filter(Transaction.portfolio_id == p.id)
        .order_by(Transaction.timestamp.asc())
        .all()
    )

    # 3) compute holdings (you already trust this logic)
    holdings = compute_holdings(txns)

    # 4) enrich with market prices
    positions = []
    total_value = 0.0
    total_cost_basis = 0.0

    for sym, h in holdings.items():
        quote = get_quote(sym)
        price = quote["price"]

        quantity = float(h["quantity"])
        avg_cost = float(h["avg_cost"])

        market_value = quantity * price
        cost_basis = quantity * avg_cost

        positions.append(
            {
                "symbol": sym,
                "quantity": quantity,
                "avg_cost": avg_cost,
                "price": price,
                "market_value": market_value,
                "cost_basis": cost_basis,
                "unrealized_gain": market_value - cost_basis,
            }
        )

        total_value += market_value
        total_cost_basis += cost_basis

    return {
        "portfolio_id": portfolio_id,
        "total_value": total_value,
        "total_cost_basis": total_cost_basis,
        "total_unrealized_gain": total_value - total_cost_basis,
        "positions": positions,
    }
