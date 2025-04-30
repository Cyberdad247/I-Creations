"""Add tools and memory fields

Revision ID: 5a8d3f7e1a2b
Revises: 
Create Date: 2025-04-29 19:26:00

"""
revision = '5a8d3f7e1a2b'
down_revision = None
from alembic import op
import sqlalchemy as sa


def upgrade():
    op.add_column('agents', sa.Column('tools', sa.Text(), nullable=True))
    op.add_column('agents', sa.Column('memory', sa.Text(), nullable=True))


def downgrade():
    op.drop_column('agents', 'tools')
    op.drop_column('agents', 'memory')
