from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


@lru_cache
def get_engine():
    # Lazy + cached so the app can boot even before Postgres is reachable.
    return create_engine(settings.database_url, pool_pre_ping=True)


def get_session_factory() -> sessionmaker:
    return sessionmaker(bind=get_engine(), autoflush=False, autocommit=False)


def get_db():
    session_factory = get_session_factory()
    db: Session = session_factory()
    try:
        yield db
    finally:
        db.close()
