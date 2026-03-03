from typing import List

from .cache import TTLCache
from .finnhub_client import fetch_quote, search_symbols

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


def symbol_search(query: str) -> List[dict]:
    query = query.strip().lower()
    if not query:
        return []

    key = f"search:{query}"
    cached = _cache.get(key)
    if cached is not None:
        return cached

    results = search_symbols(query)
    _cache.set(key, results, ttl_seconds=300)
    return results
