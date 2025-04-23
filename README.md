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
I-Creations is a full-stack platform for:
- Creating and customizing AI agents (personas, skills, roles)
- Orchestrating agents via a Super Agent engine
- Integrating with multiple AI frameworks (Manus AI, Monica AI, LangChain, OpenAI, etc.)
- Managing projects, tasks, and agent workflows
- Visualizing and interacting with agents via a modern Next.js web UI

---

## Installation & Deployment

### Local Development
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/i-creations.git
   cd i-creations
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm run dev
   ```
4. **Build for production:**
   ```sh
   npm run build && npm start
   ```

### Deployment
- **Vercel:** Deploy directly with Vercel for serverless hosting.
- **Custom Server:** Use Node.js hosting for custom deployments.
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
