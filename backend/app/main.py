from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import User, Website

from app.routers.auth import router as auth_router
from app.routers.websites import router as websites_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize FastAPI
app = FastAPI(
    title="Website Preview API",
    description="Website URL preview and bookmarking application",
    version="1.0.0"
)
from fastapi.staticfiles import StaticFiles
from pathlib import Path

# Keep your existing FastAPI configuration and CORS middleware.

SCREENSHOT_DIR = Path(__file__).resolve().parents[1] / "screenshots"
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)

app.mount(
    "/screenshots",
    StaticFiles(directory=str(SCREENSHOT_DIR)),
    name="screenshots"
)


# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(auth_router)
app.include_router(websites_router)


@app.get("/")
def root():
    return {
        "message": "Website Preview API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }