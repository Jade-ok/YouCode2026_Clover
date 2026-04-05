import json
from pathlib import Path

DB_DIR = Path(__file__).parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)  # Auto-create the data folder if it doesn't exist
ANIMALS_PATH = DB_DIR / "animals.json"
TODOS_PATH = DB_DIR / "todos.json"
HISTORY_PATH = DB_DIR / "history.json"


def read_animals() -> list:
    with open(ANIMALS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def write_animals(data: list) -> None:
    with open(ANIMALS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def read_todos() -> list:
    try:
        with open(TODOS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def write_todos(data: list) -> None:
    with open(TODOS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def read_history() -> list:
    try:
        with open(HISTORY_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def write_history(data: list) -> None:
    with open(HISTORY_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
