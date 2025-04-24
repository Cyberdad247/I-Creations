from setuptools import setup, find_packages

setup(
    name="i_creations",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "python-jose[cryptography]",
        "passlib",
        "python-multipart"
    ],
)
