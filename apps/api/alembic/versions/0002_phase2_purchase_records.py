"""phase 2 purchase records

Revision ID: 0002_phase2_purchase_records
Revises: 0001_phase1_schema
Create Date: 2026-04-15
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0002_phase2_purchase_records"
down_revision = "0001_phase1_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "purchase_records",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("household_item_id", sa.String(length=36), sa.ForeignKey("household_items.id"), nullable=False),
        sa.Column("platform", sa.String(length=50), nullable=False),
        sa.Column("sku_title", sa.String(length=200), nullable=True),
        sa.Column("quantity", sa.Numeric(10, 2), nullable=False),
        sa.Column("total_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=True),
        sa.Column("purchased_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("source", sa.String(length=20), nullable=False, server_default="manual"),
        sa.Column("raw_text", sa.String(length=4000), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(
        op.f("ix_purchase_records_household_item_id"),
        "purchase_records",
        ["household_item_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_purchase_records_purchased_at"),
        "purchase_records",
        ["purchased_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_purchase_records_purchased_at"), table_name="purchase_records")
    op.drop_index(op.f("ix_purchase_records_household_item_id"), table_name="purchase_records")
    op.drop_table("purchase_records")
