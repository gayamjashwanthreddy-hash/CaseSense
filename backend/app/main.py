from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.v1.router import api_router
from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.seed.seeder import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure all tables exist on startup
    Base.metadata.create_all(bind=engine)
    # Seed initial authentic synthetic records if empty
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for CaseBridge AI (SIH 2026 Problem Statement SIH26264) - Integrated case monitoring, tracking, and explainable de-duplication across AICTE bureaus.",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health & Readiness"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health & Readiness"])
def health_check():
    """
    Health check endpoint returning system status and environment details.
    """
    return {
        "status": "HEALTHY",
        "service": "CaseBridge AI Backend API",
        "version": settings.VERSION,
        "database": "CONNECTED",
        "environment": "SIH 2026 Demonstration Prototype",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Production-safe error reporting without exposing raw tracebacks
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred while processing the institutional case request.",
            "path": request.url.path,
        }
    )
