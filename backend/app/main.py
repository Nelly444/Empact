from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, organizations, projects, search
from app.core.config import settings

app = FastAPI(title="Charity Finder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(organizations.router)
app.include_router(projects.router)
app.include_router(search.router)
