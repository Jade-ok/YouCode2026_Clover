# BE-1: FastAPI App initialization and router registration
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from routers import animals, analyze

app = FastAPI(title="EchoSource API")

# Automatically create static/images folder
STATIC_DIR = Path(__file__).parent / "static" / "images"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static directory so the frontend can access images via /static/...
app.mount("/static", StaticFiles(directory=Path(__file__).parent / "static"), name="static")

app.include_router(animals.router)
app.include_router(analyze.router)


@app.get("/")
def health_check():
    # API Health check endpoint
    return {"status": "ok", "message": "EchoSource API is running"}
