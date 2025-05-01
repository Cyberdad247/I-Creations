import sys
import os
import uvicorn

# Add the backend/fastapi directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

if __name__ == "__main__":
    # Set environment variable to indicate FastAPI is running
    os.environ["RUNNING_FASTAPI"] = "true"
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)