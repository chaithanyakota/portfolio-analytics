from .cache import TTLCache
from .finnhub_client import fetch_quote

_cache = TTLCache()

def get_quote(symbol: str) -> dict:
    
    symbol = symbol.upper().strip()
    key = f"quote:{symbol}"

    cached = _cache.get(key)
    if cached:
        return cached

    quote = fetch_quote(symbol)
    _cache.set(key, quote, ttl_seconds=30)
    return quote
