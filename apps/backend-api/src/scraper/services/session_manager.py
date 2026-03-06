from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from src.scraper.services.proxy_provider import rotate_session_id


@dataclass(frozen=True)
class RunSessionContext:
    watchlist_id: str
    run_id: str
    session_id: str
    storage_state_path: Path


class SessionManager:
    def __init__(self, state_dir: Path | str = ".scraper_state") -> None:
        self._state_dir = Path(state_dir)
        self._state_dir.mkdir(parents=True, exist_ok=True)

    def _state_file(self, watchlist_id: str) -> Path:
        state_file = self._state_dir / f"is24-{watchlist_id}.json"
        return state_file

    def _load_previous_session(self, watchlist_id: str) -> Optional[str]:
        state_file = self._state_file(watchlist_id)
        if not state_file.exists():
            return None
        try:
            data = json.loads(state_file.read_text(encoding="utf-8"))
        except Exception:
            return None
        value = data.get("session_id")
        if isinstance(value, str) and value.strip():
            return value.strip()
        return None

    def _persist_session(self, *, watchlist_id: str, session_id: str, run_id: str) -> None:
        state_file = self._state_file(watchlist_id)
        payload = {
            "watchlist_id": watchlist_id,
            "session_id": session_id,
            "last_run_id": run_id,
        }
        state_file.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")

    def start_run_session(
        self,
        *,
        watchlist_id: str,
        run_id: str,
        previous_session_id: Optional[str] = None,
        force_rotate: bool = False,
    ) -> RunSessionContext:
        previous = previous_session_id or self._load_previous_session(watchlist_id)
        session_id = rotate_session_id(previous, force_rotate=force_rotate or not bool(previous))
        self._persist_session(watchlist_id=watchlist_id, session_id=session_id, run_id=run_id)
        state_file = self._state_file(watchlist_id)
        return RunSessionContext(
            watchlist_id=watchlist_id,
            run_id=run_id,
            session_id=session_id,
            storage_state_path=state_file,
        )

    def mark_blocked(self, *, watchlist_id: str, run_id: str, previous_session_id: Optional[str]) -> str:
        next_session_id = rotate_session_id(previous_session_id, force_rotate=True)
        self._persist_session(watchlist_id=watchlist_id, session_id=next_session_id, run_id=run_id)
        return next_session_id
