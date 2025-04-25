# Contributing Guidelines

Thank you for considering contributing to our project. This document outlines the process and standards we follow.

## Preferred Workflow

1. **Fork the Repository**
   - Create your own fork of the project
   - Keep your fork synchronized with the main repository

2. **Create a Feature Branch**
   - Branch from: `main`
   - Branch naming convention: `feature/description` or `fix/description`
   - Example: `feature/add-user-authentication`

3. **Make Your Changes**
   - Commit messages should be clear and descriptive
   - Keep commits atomic and focused
   - Reference any relevant issues

4. **Submit a Pull Request (PR)**
   - Target branch: `main`
   - Provide a clear PR description
   - Link related issues
   - Wait for code review

## Development Setup

1. Refer to `README.md` for detailed setup instructions
2. Ensure all dependencies are installed: `pip install -r requirements.txt`
3. Set up pre-commit hooks for automatic code formatting

## Code Style

We follow strict Python coding standards:

- **PEP8 Compliance**: All code must follow PEP8 style guide
- **Black Formatting**: Code must be formatted using `black`
  ```bash
  black .
  ```
- **Type Hints**: Required for all function definitions
  ```python
  def process_data(input_data: dict) -> list[str]:
      pass
  ```
- **Pydantic Models**: Use for data validation and serialization
  ```python
  from pydantic import BaseModel
  
  class UserData(BaseModel):
      username: str
      email: str
  ```

## Testing Requirements

All contributions must include tests:

1. **Location**: Tests go in the `/tests` directory
2. **Framework**: Use Pytest
3. **Coverage**: New code must have test coverage
4. **Test Types Required**:
   - Unit tests for functions/classes
   - Edge case tests
   - Failure scenario tests
5. **Mocking**: Use pytest fixtures for external services
   ```python
   @pytest.fixture
   def mock_api_client():
       with patch("service.api_client") as mock:
           yield mock
   ```

## Documentation

Update documentation for any changes:

1. **Docstrings**: Required for all public functions/classes
   ```python
   def process_data(input_data: dict) -> list[str]:
       """
       Process input data and return list of strings.
       
       Args:
           input_data: Dictionary containing raw data
           
       Returns:
           List of processed strings
           
       Raises:
           ValueError: If input_data is invalid
       """
       pass
   ```
2. **Markdown Files**: Update when changing functionality
   - `README.md`: For user-facing changes
   - `PLANNING.md`: For architectural changes
   - `TASK.md`: For new features/tasks

## Questions or Issues?

- Create an issue for discussions
- Tag maintainers for urgent matters
- Join our community chat for real-time help