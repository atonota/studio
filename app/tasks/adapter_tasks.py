"""Adapter sağlık kontrolü task'ları."""

from app.core.logging import get_logger
from app.tasks.celery_app import celery_app

logger = get_logger(__name__)


@celery_app.task(name="app.tasks.adapter_tasks.check_all_adapters_health")
def check_all_adapters_health() -> dict[str, str]:
    """Tüm aktif adaptörlerin sağlık kontrolünü yap.

    Celery Beat tarafından 5 dakikada bir çağrılır.
    """
    logger.info("adapter_health_check_started")
    # Adapter health_check will be implemented here
    return {"status": "completed"}
