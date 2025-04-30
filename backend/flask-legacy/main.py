"""
Main entry point for the Creation AI Ecosystem.
Provides a simple way to start the ecosystem.
"""

import sys
import os
import argparse
from creation_ai_ecosystem import CreationAI


def main():
    """
    Main entry point for the Creation AI Ecosystem.
    """
    parser = argparse.ArgumentParser(description="Creation AI Ecosystem")
    parser.add_argument("--config", help="Path to configuration file")
    parser.add_argument("--cli", action="store_true", help="Start the command-line interface")
    args = parser.parse_args()
    
    # Create the Creation AI instance
    creation_ai = CreationAI(config_path=args.config)
    
    if args.cli:
        # Start the command-line interface
        creation_ai.start_cli()
    else:
        # Print welcome message and instructions
        print("""
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                   Creation AI Ecosystem                       ║
║                                                               ║
║  To start the CLI, run with the --cli flag:                   ║
║  python main.py --cli                                         ║
║                                                               ║
║  To use a custom configuration, use the --config flag:        ║
║  python main.py --config path/to/config.json                  ║
║                                                               ║
║  For programmatic usage, import the CreationAI class:         ║
║  from creation_ai_ecosystem import CreationAI                 ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        """)


if __name__ == "__main__":
    main()
