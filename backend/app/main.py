from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.verification import router as verification_router
from app.api.care import router as care_router
from app.api.coordination import router as coordination_router
from app.api.alerts import router as alerts_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(verification_router, prefix=f"{settings.API_V1_STR}/verification", tags=["verification"])
app.include_router(care_router, prefix=f"{settings.API_V1_STR}/care-episodes", tags=["care_episodes"])
app.include_router(coordination_router, prefix=f"{settings.API_V1_STR}/coordination", tags=["coordination"])
app.include_router(alerts_router, prefix=f"{settings.API_V1_STR}/alerts", tags=["alerts"])

@app.get("/")
def root():
    return {"message": "Welcome to SwasthyaSetu API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
