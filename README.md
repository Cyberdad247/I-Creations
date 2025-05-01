# I-Creations

A comprehensive Agent Creation Ecosystem for building, managing, and orchestrating AI agents with modular frameworks, web UI, and advanced orchestration capabilities.

---

## Table of Contents
- [Overview](#overview)
- [Installation & Deployment](#installation--deployment)
- [Web UI & Workflows](#web-ui--workflows)
- [Types of Agents & How to Create](#types-of-agents--how-to-create)
- [Adding MCP Servers](#adding-mcp-servers)
- [Frameworks & Usage Examples](#frameworks--usage-examples)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
I-Creations is a comprehensive Agent Creation Ecosystem built as a monorepo. It provides a full-stack platform for:
- Creating and customizing AI agents (personas, skills, roles)
- Orchestrating agents via a Super Agent engine
- Integrating with multiple AI frameworks (Manus AI, Monica AI, LangChain, OpenAI, etc.)
- Managing projects, tasks, and agent workflows
- Visualizing and interacting with agents via a modern Next.js web UI

The project is structured as a monorepo containing:
- **`backend/fastapi`**: The FastAPI-based backend API.
- **`frontend`**: The Next.js web user interface.
- **`docs`**: Documentation files.
- Other supporting directories and files.

---

## Installation & Deployment
---

**Frontend-Backend Integration:**
The frontend (Next.js in `/frontend`) is now connected to the backend API (`/backend/fastapi`). Key integration points:

- Agent CRUD operations (create, read, update, delete)
- Tools management (configure and assign tools to agents) — **fully integrated**
- Memory configuration (view and edit agent memory settings) — **fully integrated**
- Settings management (update agent parameters) — *UI/backend integration pending*

Configuration:
1. Set `NEXT_PUBLIC_BACKEND_URL` in `.env` (e.g., `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`)
2. All API calls use axios with proper error handling
3. Loading states implemented for all async operations
4. TypeScript types shared between frontend and backend

The following frontend pages are connected:
- `/agent-tools` - Manage agent tools (API connected)
- `/agent-memory` - Configure agent memory (API connected)
- `/agent-settings` - Update agent settings (**pending**)
---

### Local Development Setup
To set up the project for local development, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/i-creations.git
   cd i-creations
   ```

2. **Set up Environment Variables:**
   Copy the example environment file and update it with your settings. Refer to `env.md` for detailed information on required variables.
   ```sh
   cp .env.example .env
   # Edit .env with your specific configurations
   ```

3. **Install Backend Dependencies:**
   Navigate to the backend directory and install the Python dependencies.
   ```sh
   cd backend/fastapi
   pip install -r requirements.txt
   ```

4. **Run Backend Migrations (if applicable):**
   If your database requires migrations (e.g., with SQLAlchemy), run them. (Note: Specific migration commands depend on the chosen ORM and setup, e.g., Alembic).
   ```sh
   # Example using Alembic (adjust if using a different tool)
   # alembic upgrade head
   ```

5. **Start the Backend Server:**
   Run the FastAPI development server.
   ```sh
   uvicorn main:app --reload
   ```
   The backend should now be running, typically at `http://localhost:8000`.

6. **Install Frontend Dependencies:**
   Open a new terminal, navigate to the frontend directory, and install the Node.js dependencies.
   ```sh
   cd frontend
   npm install
   ```

7. **Start the Frontend Development Server:**
   Run the Next.js development server.
   ```sh
   npm run dev
   ```
   The frontend should now be running, typically at `http://localhost:3000`.

### Running Tests
Instructions for running tests will be added here.

### Deployment
- **Vercel:** Deploy the `frontend` directory directly with Vercel for serverless hosting.
- **Custom Server:** Use Node.js hosting for custom frontend deployments.
- **Backend Deployment:** The FastAPI backend can be deployed using various methods, such as uvicorn with Gunicorn, Docker, or cloud-specific services (e.g., Heroku, AWS Elastic Beanstalk).
- **MCP Server Integration:** See [Adding MCP Servers](#adding-mcp-servers).

---

## Web UI & Workflows
- **Modern Next.js UI** with Tailwind CSS, Framer Motion animations, and modular components.
- **Pages:**
  - `/agents` – Manage and view all agents (with gaming-style progress, badges, and cards)
  - `/dashboard` – Leaderboards, achievements, and stats
  - `/contact` – Support and feedback form
  - `/achievements` – Animated achievements grid
- **Workflows:**
  - Create agents, assign skills/personas, and orchestrate tasks
  - Visualize agent progress, unlock achievements, and compete on leaderboards
  - Use the UI to trigger agent actions, view logs, and manage projects

---

## Types of Agents & How to Create
- **BaseAgent:** Core agent with customizable skills and persona
- **Persona Agents:** Agents with unique personalities and communication styles
- **Skill Agents:** Specialized for tasks (e.g., research, coding, content creation)
- **Super Agent:** Orchestrates and delegates tasks to other agents

### Creating an Agent (Web UI)
1. Go to `/agents` and click "Create Agent"
2. Fill in agent name, select persona, assign skills
3. Save to add the agent to your ecosystem

### Creating an Agent (Code)
```python
from creation_ai_ecosystem import CreationAI
creation_ai = CreationAI()
agent = creation_ai.create_agent("Research Agent", "Specialized in gathering information")
```

---

## Adding MCP Servers
- **MCP (Model Context Protocol) servers** allow you to connect external AI models and services.
- To add an MCP server:
  1. Configure the server endpoint in your `.env` or config file:
     ```env
     MCP_SERVER_URL=https://your-mcp-server.com
     ```
  2. Register the server in the web UI or via the backend API.
  3. Assign agents or tasks to use the MCP server for inference or orchestration.

---

## Frameworks & Usage Examples

### 1. **Manus AI**
- **Purpose:** Information processing, content creation
- **Example:**
  ```python
  info = creation_ai.use_manus_ability("information_gathering", query="AI trends in 2025")
  ```

### 2. **Monica AI**
- **Purpose:** UI and design assistance
- **Example:**
  ```python
  design = creation_ai.use_monica_capability("design_assistance", design_brief="Create a modern dashboard for AI analytics")
  ```

### 3. **LangChain & OpenAI**
- **Purpose:** Advanced agent orchestration, LLM integration
- **Example:**
  ```python
  result = creation_ai.process_query("Analyze the impact of transformer models on NLP")
  ```

### 4. **Web UI (Next.js)**
- **Purpose:** Visual agent management, workflows, and analytics
- **Example:**
  - Use `/dashboard` to view agent stats and achievements
  - Use `/agents` to create, edit, and manage agents

---

## Contributing
- Fork the repo and submit pull requests
- See `CONTRIBUTING.md` for guidelines

## License
MIT License – see LICENSE file for details
