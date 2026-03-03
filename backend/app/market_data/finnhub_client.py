import os
from typing import List

import requests
from dotenv import load_dotenv

load_dotenv()

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
if not FINNHUB_API_KEY:
    raise ValueError("FINNHUB_API_KEY is not set")

BASE_URL = "https://finnhub.io/api/v1"


def fetch_quote(symbol: str) -> dict:
    """
    Call Finnhub quote endpoint:
    https://finnhub.io/docs/api/quote
    """
    symbol = symbol.upper().strip()

    resp = requests.get(
        f"{BASE_URL}/quote",
        params={"symbol": symbol, "token": FINNHUB_API_KEY},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    if not data or data.get("c") is None:
        raise ValueError(f"Invalid quote response for symbol={symbol}: {data}")

    return {
        "symbol": symbol,
        "price": float(data["c"]),
        "timestamp": int(data.get("t", 0)),
    }


def search_symbols(query: str) -> List[dict]:
    """
    Call Finnhub symbol search endpoint:
    https://finnhub.io/docs/api/symbol-search
    """
    resp = requests.get(
        f"{BASE_URL}/search",
        params={"q": query, "token": FINNHUB_API_KEY},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    results = []
    for item in data.get("result", []):
        sym_type = item.get("type", "")
        if sym_type not in ("Common Stock", "ADR", "ETF", "ETP"):
            continue
        results.append({
            "symbol": item["symbol"],
            "description": item.get("description", ""),
            "type": sym_type,
        })
    return results
