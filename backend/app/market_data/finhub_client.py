import os
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

    Returns normalized data:
    {
      "symbol": "AAPL",
      "price": 192.12,
      "timestamp": 1700000000
    }
    """
    symbol = symbol.upper().strip()

    resp = requests.get(
        f"{BASE_URL}/quote",
        params={"symbol": symbol, "token": FINNHUB_API_KEY},
        timeout=10,
    )
    resp.raise_for_status()
    data = resp.json()

    # c = current price, t = timestamp
    if not data or data.get("c") is None:
        raise ValueError(f"Invalid quote response for symbol={symbol}: {data}")

    return {
        "symbol": symbol,
        "price": float(data["c"]),
        "timestamp": int(data.get("t", 0)),
    }
