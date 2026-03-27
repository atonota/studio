"""Celery uygulama konfigürasyonu."""

from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "atonota",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    broker_connection_retry_on_startup=True,
)

celery_app.conf.beat_schedule = {
    "adapter-health-check": {
        "task": "app.tasks.adapter_tasks.check_all_adapters_health",
        "schedule": 300.0,  # 5 dakika
    },
}

celery_app.autodiscover_tasks(["app.tasks"])
