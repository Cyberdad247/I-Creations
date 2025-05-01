# API Specification

This document provides an overview of the REST API endpoints provided by the FastAPI backend (`backend/fastapi`).

The API serves as the interface for the frontend to interact with the agent creation ecosystem, managing agents, tools, memory, and settings.

## Base URL

The base URL for the API is typically `http://localhost:8000` in a local development environment, as configured by the `NEXT_PUBLIC_BACKEND_URL` environment variable in the frontend.

## Authentication

API endpoints that require authentication use JWT (JSON Web Tokens). Users must obtain a token by authenticating via the `/auth/login` endpoint and include the token in the `Authorization` header of subsequent requests as a Bearer token.

Example Header:
`Authorization: Bearer your_jwt_token_here`

## Endpoints

### Authentication

- **`POST /auth/login`**
  - **Description:** Authenticates a user and returns a JWT token.
  - **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "access_token": "string",
      "token_type": "bearer"
    }
    ```

- **`POST /auth/register`**
  - **Description:** Registers a new user.
  - **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "message": "User registered successfully"
    }
    ```

### Agents

- **`GET /agents/`**
  - **Description:** Retrieves a list of all agents.
  - **Authentication:** Required
  - **Response:** `List[Agent]` (See `backend/fastapi/schemas.py` for Agent schema)

- **`GET /agents/{agent_id}`**
  - **Description:** Retrieves a specific agent by ID.
  - **Authentication:** Required
  - **Parameters:**
    - `agent_id`: The ID of the agent (integer).
  - **Response:** `Agent` (See `backend/fastapi/schemas.py` for Agent schema)

- **`POST /agents/`**
  - **Description:** Creates a new agent.
  - **Authentication:** Required
  - **Request Body:** `AgentCreate` (See `backend/fastapi/schemas.py` for AgentCreate schema)
  - **Response:** `Agent` (See `backend/fastapi/schemas.py` for Agent schema)

- **`PUT /agents/{agent_id}`**
  - **Description:** Updates an existing agent.
  - **Authentication:** Required
  - **Parameters:**
    - `agent_id`: The ID of the agent (integer).
  - **Request Body:** `AgentUpdate` (See `backend/fastapi/schemas.py` for AgentUpdate schema)
  - **Response:** `Agent` (See `backend/fastapi/schemas.py` for Agent schema)

- **`DELETE /agents/{agent_id}`**
  - **Description:** Deletes an agent.
  - **Authentication:** Required
  - **Parameters:**
    - `agent_id`: The ID of the agent (integer).
  - **Response:**
    ```json
    {
      "message": "Agent deleted successfully"
    }
    ```

### Tools

- **`GET /tools/`**
  - **Description:** Retrieves a list of available tools.
  - **Authentication:** Required
  - **Response:** `List[Tool]` (See `backend/fastapi/schemas.py` for Tool schema)

- **`POST /tools/`**
  - **Description:** Creates a new tool.
  - **Authentication:** Required
  - **Request Body:** `ToolCreate` (See `backend/fastapi/schemas.py` for ToolCreate schema)
  - **Response:** `Tool` (See `backend/fastapi/schemas.py` for Tool schema)

- **`PUT /tools/{tool_id}`**
  - **Description:** Updates an existing tool.
  - **Authentication:** Required
  - **Parameters:**
    - `tool_id`: The ID of the tool (integer).
  - **Request Body:** `ToolUpdate` (See `backend/fastapi/schemas.py` for ToolUpdate schema)
  - **Response:** `Tool` (See `backend/fastapi/schemas.py` for Tool schema)

- **`DELETE /tools/{tool_id}`**
  - **Description:** Deletes a tool.
  - **Authentication:** Required
  - **Parameters:**
    - `tool_id`: The ID of the tool (integer).
  - **Response:**
    ```json
    {
      "message": "Tool deleted successfully"
    }
    ```

### Memory

- **`GET /memory/{agent_id}`**
  - **Description:** Retrieves the memory associated with a specific agent.
  - **Authentication:** Required
  - **Parameters:**
    - `agent_id`: The ID of the agent (integer).
  - **Response:** `AgentMemory` (See `backend/fastapi/schemas.py` for AgentMemory schema)

- **`PUT /memory/{agent_id}`**
  - **Description:** Updates the memory for a specific agent.
  - **Authentication:** Required
  - **Parameters:**
    - `agent_id`: The ID of the agent (integer).
  - **Request Body:** `AgentMemoryUpdate` (See `backend/fastapi/schemas.py` for AgentMemoryUpdate schema)
  - **Response:** `AgentMemory` (See `backend/fastapi/schemas.py` for AgentMemory schema)

### Settings

- **`GET /settings/{agent_id}`**
  - **Description:** Retrieves the settings for a specific agent.
  - **Authentication:** Required
  - **Parameters:**
    - `agent_id`: The ID of the agent (integer).
  - **Response:** `AgentSettings` (See `backend/fastapi/schemas.py` for AgentSettings schema)

- **`PUT /settings/{agent_id}`**
  - **Description:** Updates the settings for a specific agent.
  - **Authentication:** Required
  - **Parameters:**
    - `agent_id`: The ID of the agent (integer).
  - **Request Body:** `AgentSettingsUpdate` (See `backend/fastapi/schemas.py` for AgentSettingsUpdate schema)
  - **Response:** `AgentSettings` (See `backend/fastapi/schemas.py` for AgentSettings schema)

## Schemas

Refer to `backend/fastapi/schemas.py` for detailed Pydantic models defining the structure of request and response bodies.