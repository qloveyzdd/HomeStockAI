"""phase 2 inventory states

Revision ID: 0003_phase2_inventory_states
Revises: 0002_phase2_purchase_records
Create Date: 2026-04-15
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0003_phase2_inventory_states"
down_revision = "0002_phase2_purchase_records"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "inventory_states",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("household_item_id", sa.String(length=36), sa.ForeignKey("household_items.id"), nullable=False),
        sa.Column("estimated_remaining_qty", sa.Numeric(10, 2), nullable=False),
        sa.Column("estimated_remaining_days", sa.Integer(), nullable=False),
        sa.Column("daily_consumption_rate", sa.Numeric(10, 2), nullable=False),
        sa.Column("confidence_score", sa.Numeric(3, 2), nullable=False),
        sa.Column("below_safety_stock", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("calc_reason", sa.Text(), nullable=False),
        sa.Column("last_recalc_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("household_item_id"),
    )
    op.create_index(
        op.f("ix_inventory_states_household_item_id"),
        "inventory_states",
        ["household_item_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_inventory_states_household_item_id"), table_name="inventory_states")
    op.drop_table("inventory_states")
