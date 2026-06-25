from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base

# Dimension of OpenAI text-embedding-3-small
EMBEDDING_DIM = 1536


class ProjectEmbedding(Base):
    __tablename__ = "project_embeddings"

    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), primary_key=True)
    embedding: Mapped[list[float]] = mapped_column(Vector(EMBEDDING_DIM))
    model: Mapped[str] = mapped_column(default="text-embedding-3-small")
    generated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    project: Mapped["Project"] = relationship(back_populates="embedding")
