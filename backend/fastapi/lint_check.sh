#!/bin/bash

echo "Running Flake8..."
flake8 .

echo "Running Pylint..."
pylint --rcfile=pylintrc .

echo "Running Black check..."
black --check .

echo "Backend linting and formatting checks complete."