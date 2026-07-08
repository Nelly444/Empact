from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(primary_key=True)
    globalgiving_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    home_country: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    # GlobalGiving returns a list of countries; flattened to comma-separated
    # here, so exact-match filtering on it is substring-based (see search.py).
    countries_served: Mapped[str | None] = mapped_column(String, nullable=True)
    # Combined from GlobalGiving's separate addressLine1/2, city, state, postal
    # fields (see parse_organization) — display-only, not filtered/searched on.
    address: Mapped[str | None] = mapped_column(String, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String, nullable=True)
    homepage_url: Mapped[str | None] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    projects: Mapped[list["Project"]] = relationship(back_populates="organization")
