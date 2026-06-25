from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    globalgiving_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    org_id: Mapped[int] = mapped_column(ForeignKey("organizations.id"), index=True)

    title: Mapped[str] = mapped_column(String, index=True)
    theme: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    description_raw: Mapped[str | None] = mapped_column(Text, nullable=True)

    funding_goal: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    funding_raised: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    # Generated once by the batch job and cached; never regenerated on read.
    summary_cached: Mapped[str | None] = mapped_column(Text, nullable=True)
    summary_generated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    organization: Mapped["Organization"] = relationship(back_populates="projects")
    embedding: Mapped["ProjectEmbedding"] = relationship(back_populates="project", uselist=False)
    snapshots: Mapped[list["ProjectSnapshot"]] = relationship(back_populates="project")
