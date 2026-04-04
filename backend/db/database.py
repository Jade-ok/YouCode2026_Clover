import json
from pathlib import Path

DB_DIR = Path(__file__).parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)  # Auto-create the data folder if it doesn't exist
ANIMALS_PATH = DB_DIR / "animals.json"
TEMPORARY_DATA_PATH = DB_DIR / "temporary_data.json"


def read_animals() -> list:
    with open(ANIMALS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def read_temporary_data() -> list:
    try:
        with open(TEMPORARY_DATA_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def write_temporary_data(data: list) -> None:
    with open(TEMPORARY_DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
