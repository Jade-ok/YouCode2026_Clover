# BE-1: FastAPI App initialization and router registration
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import animals, analyze

app = FastAPI(title="EchoSource API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(animals.router)
app.include_router(analyze.router)


@app.get("/")
def health_check():
    # API Health check endpoint
    return {"status": "ok", "message": "EchoSource API is running"}
