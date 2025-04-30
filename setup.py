from setuptools import setup, find_packages

setup(
    name="agent-platform",
    version="0.1.0",
    description="Agent Platform API Service",
    packages=find_packages(where="backend"),
    package_dir={"": "backend"},
    install_requires=[
        "fastapi>=0.95.0",
        "uvicorn>=0.21.0",
        "sqlalchemy>=2.0.0",
        "pydantic>=1.10.0",
        "python-dotenv>=0.21.0"
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "httpx>=0.23.0",
            "black>=22.0.0",
            "mypy>=0.991"
        ]
    },
    python_requires=">=3.9",
)