from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, organizations, projects, search
from app.core.auth import require_api_key
from app.core.config import settings

app = FastAPI(title="Charity Finder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(organizations.router, dependencies=[Depends(require_api_key)])
app.include_router(projects.router, dependencies=[Depends(require_api_key)])
app.include_router(search.router, dependencies=[Depends(require_api_key)])
