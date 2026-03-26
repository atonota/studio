import os

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://atonota:atonota_dev@localhost:5432/atonota_test")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
os.environ.setdefault("JWT_SECRET", "test-secret-key")
os.environ.setdefault("ENVIRONMENT", "test")
