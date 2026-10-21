from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.analyze import router as analyze_router
from app.routers.analyses import router as analyses_router
from app.routers.settings import router as settings_router

__all__ = ["health_router", "auth_router", "analyze_router", "analyses_router", "settings_router"]
