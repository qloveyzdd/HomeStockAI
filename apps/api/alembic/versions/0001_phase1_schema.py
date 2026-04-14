"""phase 1 initial schema

Revision ID: 0001_phase1_schema
Revises:
Create Date: 2026-04-14
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "0001_phase1_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "accounts",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_accounts_phone"), "accounts", ["phone"], unique=True)

    op.create_table(
        "households",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("owner_account_id", sa.String(length=36), sa.ForeignKey("accounts.id"), nullable=False),
        sa.Column("household_size", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("has_pet", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("pet_type", sa.String(length=50), nullable=True),
        sa.Column("has_baby", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("storage_level", sa.String(length=20), nullable=False, server_default="medium"),
        sa.Column("price_sensitivity", sa.String(length=20), nullable=False, server_default="medium"),
        sa.Column("stock_style", sa.String(length=20), nullable=False, server_default="normal"),
        sa.Column("preferred_platforms", sa.JSON(), nullable=True),
        sa.Column("reminder_tolerance", sa.String(length=20), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("owner_account_id"),
    )
    op.create_index(op.f("ix_households_owner_account_id"), "households", ["owner_account_id"], unique=True)

    op.create_table(
        "household_items",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("household_id", sa.String(length=36), sa.ForeignKey("households.id"), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("brand", sa.String(length=100), nullable=True),
        sa.Column("spec_text", sa.String(length=100), nullable=True),
        sa.Column("unit", sa.String(length=30), nullable=False, server_default="件"),
        sa.Column("safety_stock_days", sa.Integer(), nullable=False, server_default="7"),
        sa.Column("preferred_platform", sa.String(length=50), nullable=True),
        sa.Column("replaceable", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("enabled", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_custom", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f("ix_household_items_household_id"), "household_items", ["household_id"], unique=False)
    op.create_index(op.f("ix_household_items_category"), "household_items", ["category"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_household_items_category"), table_name="household_items")
    op.drop_index(op.f("ix_household_items_household_id"), table_name="household_items")
    op.drop_table("household_items")
    op.drop_index(op.f("ix_households_owner_account_id"), table_name="households")
    op.drop_table("households")
    op.drop_index(op.f("ix_accounts_phone"), table_name="accounts")
    op.drop_table("accounts")
