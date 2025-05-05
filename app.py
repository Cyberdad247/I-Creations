from flask import Flask, jsonify
from scenario_engine import ScenarioEngine
from real_world_simulator import EcommerceSimulator, CodingAssistantSimulator

app = Flask(__name__)
scenario_engine = ScenarioEngine('scenarios')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/select_scenario/<scenario_name>')
def select_scenario(scenario_name):
    try:
        scenario = scenario_engine.select_scenario(scenario_name)
        return jsonify(scenario)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404

@app.route('/initialize_scenario/<scenario_name>')
def initialize_scenario(scenario_name):
    try:
        initial_state = scenario_engine.initialize_scenario(scenario_name)
        return jsonify(initial_state)
    except ValueError as e:
        return jsonify({'error': str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True)