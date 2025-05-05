# I-Creation

A comprehensive agent creation ecosystem for building, managing, and orchestrating AI agents with modular frameworks, web UI, and advanced orchestration capabilities.

---

## Table of Contents
- [Overview](#overview)
- [Installation & Deployment](#installation--deployment)
- [Cloning with Submodule](#cloning-with-submodule)
- [Web UI & Workflow](#web-ui--workflow)
- [Types of Agent & How to Create](#types-of-agent--how-to-create)
- [Adding MCP Server](#adding-mcp-server)
- [Framework & Usage Example](#framework--usage-example)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
I-Creation is a comprehensive Agent Creation Ecosystem built as a monorepo. It provides a full-stack platform for:
- Creating and customizing AI agents (persona, skill, role)
- Orchestrating agent via a Super Agent Engine
- Integrating with multiple AI framework (Manus AI, Monica AI, LangChain, OpenAI, etc.)
- Managing project, task, and agent workflow
- Visualizing and interacting with agent via a modern Next.js web UI

The project is structured as a monorepo containing:
- **`backend/fastapi`**: The FastAPI based backend API
- **`frontend`**: The Next.js web user interface
- **`doc`**: Documentation file
- Other supporting directory and file

---

## Installation & Deployment
---

**Frontend-Backend Integration:**
The frontend (Next.js in `/frontend`) is now connected to backend API (`/backend/fastapi`). Key integration point:

- Agent CRUD operation (create, read, update, delete)
- Tool management (configure and assign tool to agent) — **fully integrated**
- Memory configuration (view and edit agent memory setting) — **fully integrated**
- Setting management (update agent parameter) — *UI/backend integration pending*

Configuration:
1. Set `NEXT_PUBLIC_BACKEND_URL` in `.env` (e.g. `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`)
2. All API call use axios with proper error handling
3. Loading state implemented for all async operation
4. TypeScript type shared between frontend and backend

The following frontend page is connected:
- `/agent-tool` - manage agent tool (API connected)
- `/agent-memory` - configure agent memory (API connected)
- `/agent-setting` - update agent setting (**pending**)
---

### Local Development Setup
To setup project for local development, follow these step:

1. **Clone repository:**
   ```sh
   git clone https://github.com/yourusername/i-creation.git
   cd i-creation
   ```

2. **Setup environment variable:**
   Copy example environment file and update with your setting. Refer to `env.md` for detail on required variable.
   ```sh
   cp .env.example .env
   # edit .env with your specific configuration
   ```

3. **Install backend dependency:**
   Navigate to backend directory and install Python dependency.
   ```sh
   cd backend/fastapi
   pip install -r requirement.txt
   ```

4. **Run backend migration (if applicable):**
   If your database require migration (e.g. with SQLAlchemy), run it. (Note: specific migration command depend on chosen ORM and setup e.g. Alembic)
   ```sh
   # example using Alembic (adjust if using different tool)
   # alembic upgrade head
   ```

5. **Start backend server:**
   Run FastAPI development server.
   ```sh
   uvicorn main:app --reload
   ```
   Backend should now be running, typically at `http://localhost:8000`

6. **Install frontend dependency:**
   Open new terminal, navigate to frontend directory and install Node.js dependency.
   ```sh
   cd frontend
   npm install
   ```

7. **Start frontend development server:**
   Run Next.js development server.
   ```sh
   npm run dev
   ```
   Frontend should now be running, typically at `http://localhost:3000`

### Cloning with Submodule

To clone this repository with all submodule, use:
```bash
git clone --recurse-submodule https://github.com/Cyberdad247/I-Creation.git
```

### Running Test
Instruction for running test will be added here.

### Deployment
- **Vercel:** Deploy `frontend` directory directly with Vercel for serverless hosting
- **Custom server:** Use Node.js hosting for custom frontend deployment
- **Backend deployment:** FastAPI backend can be deployed using various method, such as uvicorn with Gunicorn, Docker, or cloud specific service (e.g. Heroku, AWS Elastic Beanstalk)
- **MCP server integration:** See [Adding MCP Server](#adding-mcp-server)

---

## Web UI & Workflow
- **Modern Next.js UI** with Tailwind CSS, Framer Motion animation and modular component
- **Page:**
  - `/agent` – manage and view all agent (with gaming style progress, badge and card)
  - `/dashboard` – leaderboard, achievement and stat
  - `/contact` – support and feedback form
  - `/achievement` – animated achievement grid
- **Workflow:**
  - Create agent, assign skill/persona and orchestrate task
  - Visualize agent progress, unlock achievement and compete on leaderboard
  - Use UI to trigger agent action, view log and manage project

---

## Type of Agent & How to Create
- **BaseAgent:** Core agent with customizable skill and persona
- **Persona Agent:** Agent with unique personality and communication style
- **Skill Agent:** Specialized for task (e.g. research, coding, content creation)
- **Super Agent:** Orchestrate and delegate task to other agent

### Creating Agent (Web UI)
1. Go to `/agent` and click "Create Agent"
2. Fill in agent name, select persona, assign skill
3. Save to add agent to your ecosystem

### Creating Agent (Code)
```python
from creation_ai_ecosystem import CreationAI
creation_ai = CreationAI()
agent = creation_ai.create_agent("Research Agent", "Specialized in gathering information")
```

---

## Adding MCP Server
- **MCP (Model Context Protocol) Server** allow you to connect external AI model and service
- To add MCP server:
  1. Configure server endpoint in your `.env` or config file:
     ```env
     MCP_SERVER_URL=https://your-mcp-server.com
     ```
  2. Register server in web UI or via backend API
  3. Assign agent or task to use MCP server for inference or orchestration

---

## Framework & Usage Example

### 1. **Manus AI**
- **Purpose:** Information processing, content creation
- **Example:**
  ```python
  info = creation_ai.use_manus_ability("information_gathering", query="AI trend in 2025")
  ```

### 2. **Monica AI**
- **Purpose:** UI and design assistance
- **Example:**
  ```python
  design = creation_ai.use_monica_capability("design_assistance", design_brief="Create modern dashboard for AI analytics")
  ```

### 3. **LangChain & OpenAI**
- **Purpose:** Advanced agent orchestration, LLM integration
- **Example:**
  ```python
  result = creation_ai.process_query("Analyze impact of transformer model on NLP")
  ```

### 4. **Web UI (Next.js)**
- **Purpose:** Visual agent management, workflow and analytics
- **Example:**
  - Use `/dashboard` to view agent stat and achievement
  - Use `/agent` to create, edit and manage agent

---

## Contributing
- Fork repo and submit pull request
- See `CONTRIBUTING.md` for guideline

## License
MIT License – see LICENSE file for detail
