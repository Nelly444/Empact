"""initial schema: organizations, projects, project_embeddings, project_snapshots

Revision ID: 0001
Revises:
Create Date: 2026-06-25
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

EMBEDDING_DIM = 1536


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "organizations",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("globalgiving_id", sa.String, unique=True, index=True, nullable=False),
        sa.Column("name", sa.String, index=True, nullable=False),
        sa.Column("home_country", sa.String, index=True, nullable=True),
        sa.Column("countries_served", sa.String, nullable=True),
        sa.Column("logo_url", sa.String, nullable=True),
        sa.Column("homepage_url", sa.String, nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "projects",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("globalgiving_id", sa.String, unique=True, index=True, nullable=False),
        sa.Column("org_id", sa.Integer, sa.ForeignKey("organizations.id"), index=True, nullable=False),
        sa.Column("title", sa.String, index=True, nullable=False),
        sa.Column("theme", sa.String, index=True, nullable=True),
        sa.Column("description_raw", sa.Text, nullable=True),
        sa.Column("funding_goal", sa.Numeric(12, 2), nullable=True),
        sa.Column("funding_raised", sa.Numeric(12, 2), nullable=True),
        sa.Column("summary_cached", sa.Text, nullable=True),
        sa.Column("summary_generated_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "project_embeddings",
        sa.Column("project_id", sa.Integer, sa.ForeignKey("projects.id"), primary_key=True),
        sa.Column("embedding", Vector(EMBEDDING_DIM), nullable=False),
        sa.Column("model", sa.String, nullable=False, server_default="text-embedding-3-small"),
        sa.Column("generated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.execute(
        "CREATE INDEX project_embeddings_embedding_idx ON project_embeddings "
        "USING hnsw (embedding vector_cosine_ops)"
    )

    op.create_table(
        "project_snapshots",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("project_id", sa.Integer, sa.ForeignKey("projects.id"), index=True, nullable=False),
        sa.Column("amount_raised", sa.Numeric(12, 2), nullable=False),
        sa.Column("captured_at", sa.DateTime(timezone=True), server_default=sa.func.now(), index=True),
    )


def downgrade() -> None:
    op.drop_table("project_snapshots")
    op.execute("DROP INDEX IF EXISTS project_embeddings_embedding_idx")
    op.drop_table("project_embeddings")
    op.drop_table("projects")
    op.drop_table("organizations")
