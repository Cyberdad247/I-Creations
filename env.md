# Environment Variables

This document outlines the environment variables required to run the I-Creations project, covering both the FastAPI backend and the Next.js frontend.

## Project Root (`.env` file)

It is recommended to use a `.env` file at the project root to manage environment variables for local development.

```dotenv
# FastAPI Backend
# Database URL for the backend.
# Example for SQLite: sqlite:///./sql_app.db
# Example for PostgreSQL: postgresql://user:password@host:port/database
DATABASE_URL=sqlite:///./sql_app.db

# Secret key for JWT token generation.
# **IMPORTANT:** Change this to a strong, unique secret in production.
SECRET_KEY=your-secret-key

# Algorithm for JWT token generation.
ALGORITHM=HS256

# Access token expiration time in minutes.
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Next.js Frontend
# Public URL for the backend API.
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Placeholder for production secrets (e.g., Supabase secrets)
# In a production environment, sensitive variables like DATABASE_URL and SECRET_KEY
# should be loaded from a secure source (e.g., Supabase secrets, Kubernetes secrets, etc.)
# SUPABASE_URL=your_supabase_url
# SUPABASE_KEY=your_supabase_key
# EXTERNAL_API_KEY=your_external_api_key
```

## Backend (FastAPI)

The FastAPI backend uses `pydantic-settings` to load configuration from environment variables, with fallback to a `.env` file.

Required variables:
*   `DATABASE_URL`: Connection string for the database.
*   `SECRET_KEY`: Secret key for JWT.
*   `ALGORITHM`: JWT algorithm.
*   `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT expiration time.

Sensitive variables (`DATABASE_URL`, `SECRET_KEY`) should be managed securely in production.

## Frontend (Next.js)

The Next.js frontend accesses environment variables via `process.env`. Public variables must be prefixed with `NEXT_PUBLIC_`.

Required variables:
*   `NEXT_PUBLIC_BACKEND_URL`: The URL of the FastAPI backend.

Sensitive variables should not be exposed directly in the frontend.

## Production Considerations

For production deployments, environment variables should be configured directly in the hosting environment (e.g., server settings, container orchestration secrets) rather than relying on a `.env` file. Sensitive variables should be loaded from a secure secrets management system.
