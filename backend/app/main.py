from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, organizations, projects, search
from app.core.config import settings
from app.core.rate_limit import rate_limit_general

app = FastAPI(title="Empact API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(organizations.router, dependencies=[Depends(rate_limit_general)])
app.include_router(projects.router, dependencies=[Depends(rate_limit_general)])
app.include_router(search.router, dependencies=[Depends(rate_limit_general)])
