# Architecture Overview

The I-Creations project is built as a monorepo with a clear separation of concerns between the backend API and the frontend user interface.

## Monorepo Structure

The project utilizes a monorepo structure to manage related but distinct components within a single repository. Key directories include:

- **`backend/fastapi`**: Contains the FastAPI application that provides the REST API.
- **`frontend`**: Contains the Next.js application for the web user interface.
- **`docs`**: Contains project documentation.
- Other directories for shared code, configurations, or legacy components (`backend/flask-legacy`).

## Backend (FastAPI)

The backend is built with FastAPI, a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.

- **Purpose:**
    - Provide a RESTful API for managing agents, tools, memory, and settings.
    - Handle authentication and authorization.
    - Interact with the database.
    - Orchestrate agent execution and interactions.

- **Key Technologies:**
    - FastAPI
    - Pydantic for data validation and serialization
    - SQLAlchemy (or similar ORM) for database interactions
    - Uvicorn as the ASGI server

- **Structure:**
    - `main.py`: The main application entry point.
    - `routes/`: Contains modules defining API endpoints for different resources (agents, tools, memory, settings, auth).
    - `database.py`: Handles database connection and session management.
    - `models.py`: Defines database models.
    - `schemas.py`: Defines Pydantic schemas for request and response data.
    - `auth.py`: Handles authentication logic (JWT).
    - `config.py`: Loads application configuration from environment variables.
    - `agent_executor.py`: Contains logic for executing and orchestrating agents.

## Frontend (Next.js)

The frontend is a server-rendered React application built with Next.js. It provides a user-friendly interface for interacting with the I-Creations ecosystem.

- **Purpose:**
    - Visualize and manage agents, tools, memory, and settings.
    - Provide workflows for creating and orchestrating agents.
    - Display analytics, leaderboards, and achievements.
    - Interact with the backend API to fetch and send data.

- **Key Technologies:**
    - Next.js
    - React
    - TypeScript
    - Tailwind CSS for styling
    - Framer Motion for animations
    - Axios for API calls

- **Structure:**
    - `pages/`: Contains the application's routes and pages.
    - `components/`: Contains reusable React components.
    - `src/services/`: Contains modules for interacting with the backend API.
    - `public/`: Static assets.

## Interaction Flow

1.  The user interacts with the Frontend (Next.js) through their web browser.
2.  The Frontend makes API calls to the Backend (FastAPI) to fetch or send data (e.g., get agent list, create a new agent).
3.  The Backend processes the request, interacts with the database or other internal components (like the agent executor), and returns a response to the Frontend.
4.  The Frontend updates the UI based on the response.

Authentication is handled via JWT tokens obtained from the backend and included in frontend API requests.

## Data Storage

The project uses a relational database (configured via `DATABASE_URL`) to store persistent data such as agent definitions, user information, tools, memory, and settings.

## Agent Orchestration

The `agent_executor.py` module in the backend is responsible for orchestrating agent tasks. It interacts with different agent frameworks and models as configured.

## Extensibility

The architecture is designed to be extensible:

- **New Agent Frameworks:** Can be integrated into the backend by implementing the necessary interfaces in the agent executor.
- **New API Endpoints:** Can be added to the backend's `routes/` directory.
- **New UI Features:** Can be developed in the frontend's `pages/` and `components/` directories.
- **MCP Servers:** External AI models and services can be integrated via the Model Context Protocol.