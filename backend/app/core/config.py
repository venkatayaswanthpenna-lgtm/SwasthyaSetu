from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SwasthyaSetu API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    POSTGRES_SERVER: str = "localhost" # Override in docker-compose
    POSTGRES_USER: str = "swasthya_user"
    POSTGRES_PASSWORD: str = "swasthya_password"
    POSTGRES_DB: str = "swasthyasetu"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # Use SQLite for local demo/preview without requiring Docker
        return "sqlite:///./swasthyasetu.db"
    
    # Auth
    SECRET_KEY: str = "super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        case_sensitive = True

settings = Settings()
