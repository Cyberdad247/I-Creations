from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    SECRET_KEY: str = "your-secret-key" # TODO: Load from environment variable
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Placeholder for other sensitive settings
    # SUPABASE_URL: str = None
    # SUPABASE_KEY: str = None
    # EXTERNAL_API_KEY: str = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra='ignore')

settings = Settings()