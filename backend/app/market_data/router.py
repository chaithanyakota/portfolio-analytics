from fastapi import APIRouter, Depends, Query

from app.deps import get_current_user
from app.models import User
from app.market_data.service import symbol_search

router = APIRouter(prefix="/market-data", tags=["market-data"])


@router.get("/search")
def search(
    q: str = Query(..., min_length=1, max_length=50),
    user: User = Depends(get_current_user),
):
    results = symbol_search(q)
    return results[:15]
