from flask import Blueprint, request, jsonify, send_file
from pydantic import ValidationError
from models import get_db_pool
from pydantic_ai_coder import AgentDefinition
from utils import error_response
import json
import io

agent_bp = Blueprint("agent_bp", __name__)

# Create agent
def agent_to_row(agent: AgentDefinition):
    return (
        agent.name,
        agent.description,
        agent.provider,
        agent.model,
        json.dumps([tool.dict() for tool in agent.tools]),
        json.dumps(agent.goals),
        agent.max_iterations,
        json.dumps(agent.initial_state) if agent.initial_state else None,
        agent.schema_version
    )

@agent_bp.route("/", methods=["POST"])
def create_agent():
    try:
        data = request.get_json()
        agent = AgentDefinition(**data)
    except ValidationError as e:
        return error_response(e.errors(), 422)
    except Exception as e:
        return error_response(str(e), 400)
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO agents (name, description, provider, model, tools, goals, max_iterations, initial_state, schema_version)
                VALUES (%s, %s, %s, %s, %s::jsonb, %s::jsonb, %s, %s::jsonb, %s)
                RETURNING id;
            """, agent_to_row(agent))
            conn.commit()
            agent_id = cur.fetchone()[0]
        return jsonify({"id": agent_id, **agent.dict()}), 201
    except Exception as e:
        conn.rollback()
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)

# Get all agents
@agent_bp.route("/", methods=["GET"])
def get_agents():
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, description, provider, model, tools, goals, max_iterations, initial_state, schema_version FROM agents;")
            rows = cur.fetchall()
            agents = []
            for row in rows:
                agents.append({
                    "id": row[0],
                    "name": row[1],
                    "description": row[2],
                    "provider": row[3],
                    "model": row[4],
                    "tools": json.loads(row[5]) if row[5] else [],
                    "goals": json.loads(row[6]) if row[6] else [],
                    "max_iterations": row[7],
                    "initial_state": json.loads(row[8]) if row[8] else None,
                    "schema_version": row[9]
                })
        return jsonify(agents)
    except Exception as e:
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)

# Get agent by id
@agent_bp.route("/<int:agent_id>", methods=["GET"])
def get_agent(agent_id):
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, description, provider, model, tools, goals, max_iterations, initial_state, schema_version FROM agents WHERE id = %s;", (agent_id,))
            row = cur.fetchone()
            if not row:
                return error_response("Agent not found", 404)
            agent = {
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "provider": row[3],
                "model": row[4],
                "tools": json.loads(row[5]) if row[5] else [],
                "goals": json.loads(row[6]) if row[6] else [],
                "max_iterations": row[7],
                "initial_state": json.loads(row[8]) if row[8] else None,
                "schema_version": row[9]
            }
        return jsonify(agent)
    except Exception as e:
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)

# Update agent
@agent_bp.route("/<int:agent_id>", methods=["PUT"])
def update_agent(agent_id):
    try:
        data = request.get_json()
        agent = AgentDefinition(**data)
    except ValidationError as e:
        return error_response(e.errors(), 422)
    except Exception as e:
        return error_response(str(e), 400)
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE agents SET name=%s, description=%s, provider=%s, model=%s, tools=%s::jsonb, goals=%s::jsonb, max_iterations=%s, initial_state=%s::jsonb, schema_version=%s
                WHERE id=%s
                RETURNING id;
            """, agent_to_row(agent) + (agent_id,))
            if cur.rowcount == 0:
                return error_response("Agent not found", 404)
            conn.commit()
        return jsonify({"id": agent_id, **agent.dict()})
    except Exception as e:
        conn.rollback()
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)

# Delete agent
@agent_bp.route("/<int:agent_id>", methods=["DELETE"])
def delete_agent(agent_id):
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM agents WHERE id = %s RETURNING id;", (agent_id,))
            if cur.rowcount == 0:
                return error_response("Agent not found", 404)
            conn.commit()
        return jsonify({"message": "Agent deleted successfully"})
    except Exception as e:
        conn.rollback()
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)

# --- Agent Versioning ---
@agent_bp.route("/<int:agent_id>/version", methods=["POST"])
def increment_agent_version(agent_id):
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT schema_version FROM agents WHERE id = %s;", (agent_id,))
            row = cur.fetchone()
            if not row:
                return error_response("Agent not found", 404)
            current_version = row[0] or "1.0"
            # Simple version increment: 1.0 -> 1.1, 2.3 -> 2.4
            major, minor = map(int, current_version.split('.')) if '.' in current_version else (int(current_version), 0)
            minor += 1
            new_version = f"{major}.{minor}"
            cur.execute("UPDATE agents SET schema_version = %s WHERE id = %s;", (new_version, agent_id))
            conn.commit()
        return jsonify({"id": agent_id, "schema_version": new_version})
    except Exception as e:
        conn.rollback()
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)

# --- Agent Export Endpoint ---
@agent_bp.route("/<int:agent_id>/export", methods=["GET"])
def export_agent(agent_id):
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT name, description, provider, model, tools, goals, max_iterations, initial_state, schema_version FROM agents WHERE id = %s;", (agent_id,))
            row = cur.fetchone()
            if not row:
                return error_response("Agent not found", 404)
            agent_dict = {
                "name": row[0],
                "description": row[1],
                "provider": row[2],
                "model": row[3],
                "tools": json.loads(row[4]) if row[4] else [],
                "goals": json.loads(row[5]) if row[5] else [],
                "max_iterations": row[6],
                "initial_state": json.loads(row[7]) if row[7] else None,
                "schema_version": row[8]
            }
            json_bytes = json.dumps(agent_dict, indent=2).encode('utf-8')
            return send_file(io.BytesIO(json_bytes), mimetype='application/json', as_attachment=True, download_name=f"agent_{agent_id}.json")
    except Exception as e:
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)

# --- Agent Import Endpoint ---
@agent_bp.route("/import", methods=["POST"])
def import_agent():
    try:
        if 'file' in request.files:
            file = request.files['file']
            data = json.load(file)
        else:
            data = request.get_json()
        agent = AgentDefinition(**data)
    except ValidationError as e:
        return error_response(e.errors(), 422)
    except Exception as e:
        return error_response(str(e), 400)
    pool = get_db_pool()
    conn = pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO agents (name, description, provider, model, tools, goals, max_iterations, initial_state, schema_version)
                VALUES (%s, %s, %s, %s, %s::jsonb, %s::jsonb, %s, %s::jsonb, %s)
                RETURNING id;
            """, (
                agent.name,
                agent.description,
                agent.provider,
                agent.model,
                json.dumps([tool.dict() for tool in agent.tools]),
                json.dumps(agent.goals),
                agent.max_iterations,
                json.dumps(agent.initial_state) if agent.initial_state else None,
                agent.schema_version
            ))
            conn.commit()
            agent_id = cur.fetchone()[0]
        return jsonify({"id": agent_id, **agent.dict()}), 201
    except Exception as e:
        conn.rollback()
        return error_response(str(e), 500)
    finally:
        pool.putconn(conn)
