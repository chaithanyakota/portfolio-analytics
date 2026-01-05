from collections import defaultdict

def compute_holdings(transactions):
    """
    Returns holdings by symbol:
    {
      "AAPL": {"quantity": 10.0, "avg_cost": 145.23},
      ...
    }

    avg_cost here is average cost for remaining shares (simple weighted average).
    """
    
    qty = defaultdict(float)
    cost = defaultdict(float)
    
    for t in transactions:
        sym = t.symbol
        if t.side == "buy":
            qty[sym] += t.quantity
            cost[sym] += t.quantity * t.price
        else: # sell
            if qty[sym] <= 0:
                continue
            avg = cost[sym] / qty[sym] if qty[sym] else 0
            sell_qty = min(t.quantity, qty[sym])
            qty[sym] -= sell_qty
            cost[sym] -= avg * sell_qty
            
            if qty[sym] == 0:
                cost[sym] = 0
                
    holdings = {}
    for sym in qty:
        if qty[sym] > 0:
            holdings[sym] = {
                "quantity": round(qty[sym], 6),
                "avg_cost": round(cost[sym] / qty[sym], 6) if qty[sym] else 0,
            }
    return holdings
    