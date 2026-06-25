from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class ProjectSnapshot(Base):
    """Append-only record of amount_raised over time.

    Populated on every cache refresh (never overwritten) so the funding
    velocity / time-to-fully-funded forecast (PRD 10.2) has real history to
    compute from. See app/services/impact.py.
    """

    __tablename__ = "project_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), index=True)
    amount_raised: Mapped[float] = mapped_column(Numeric(12, 2))
    captured_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)

    project: Mapped["Project"] = relationship(back_populates="snapshots")
