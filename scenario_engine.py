import json
import os

class ScenarioEngine:
    def __init__(self, scenarios_folder):
        self.current_scenario = None
        self.scenarios_folder = scenarios_folder
        self.scenarios = {}
        self.load_scenarios()

    def load_scenarios(self):
        for filename in os.listdir(self.scenarios_folder):
            if not filename.endswith(".json"):
              raise ValueError(f"Invalid file in scenarios folder: {filename}. Only JSON files are allowed")
            filepath = os.path.join(self.scenarios_folder, filename)
            with open(filepath, 'r') as f:
                try:
                    self.scenarios[filename[:-5]] = json.load(f)
                except json.JSONDecodeError as e:
                    print(f"Error decoding JSON in {filename}: {e}")

    def select_scenario(self, scenario_name):
        if scenario_name not in self.scenarios:
          raise ValueError(f"Scenario '{scenario_name}' not found.")
        self.current_scenario = self.scenarios[scenario_name]
        return self.current_scenario

    def initialize_scenario(self, scenario_name):
        
        self.select_scenario(scenario_name)
        if 'initial_state' not in self.current_scenario:
            raise ValueError(f"Scenario '{scenario_name}' does not have an 'initial_state'.")
        self.current_state = self.current_scenario['initial_state']
        return self.current_state

    def progress_scenario(self):
        pass

    def get_scenario_context(self):
        pass
