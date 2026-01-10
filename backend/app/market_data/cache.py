import time
from typing import Any, Dict, Optional, Tuple

class TTLCache:
    """
    TTL cache
    - Key: string 
    - Value: anything JSON-serializable
    - TTL: seconds until it expires
    """

    def __init__(self):
        self._store: Dict[str, Tuple[float, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        item = self._store.get(key)
        if not item:
            return None
        expires_at, value = item
        if time.time() > expires_at:
            self._store.pop(key, None)
            return None
        return value

    def set(self, key: str, value: Any, ttl_seconds: int) -> None:
        expires_at = time.time() + ttl_seconds
        self._store[key] = (expires_at, value)
