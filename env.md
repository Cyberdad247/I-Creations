# Environment Variables for Agent Creation Platform

## Frontend Environment Variables
NEXT_PUBLIC_API_URL=https://agent-platform-backend.vercel.app

## Backend Environment Variables
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agent_platform
REDIS_URL=redis://<username>:<password>@<host>:<port>
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3
GROK_API_KEY=your_grok_api_key
GROK_API_URL=https://api.grok.com/v1
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_API_URL=https://api.mistral.ai/v1
PORT=5000

## Instructions for Setting Up Environment Variables in Vercel

### Backend Deployment
1. Create a new project in Vercel and link it to your backend repository
2. Go to Settings > Environment Variables
3. Add the following environment variables:
   - MONGO_URI: Your MongoDB connection string
   - REDIS_URL: Your Redis connection string
   - OPENAI_API_KEY: Your OpenAI API key
   - OLLAMA_API_URL: URL for Ollama API
   - OLLAMA_MODEL: Model name for Ollama
   - GROK_API_KEY: Your Grok API key
   - GROK_API_URL: URL for Grok API
   - GEMINI_API_KEY: Your Gemini API key
   - GEMINI_API_URL: URL for Gemini API
   - OPENROUTER_API_KEY: Your OpenRouter API key
   - OPENROUTER_API_URL: URL for OpenRouter API
   - HUGGINGFACE_API_KEY: Your HuggingFace API key
   - HUGGINGFACE_API_URL: URL for HuggingFace API
   - MISTRAL_API_KEY: Your Mistral API key
   - MISTRAL_API_URL: URL for Mistral API
   - PORT: Port number for the backend
4. Deploy the project

### Frontend Deployment
1. Create a new project in Vercel and link it to your frontend repository
2. Go to Settings > Environment Variables
3. Add the following environment variable:
   - NEXT_PUBLIC_API_URL: URL of your deployed backend (e.g., https://agent-platform-backend.vercel.app)
4. Deploy the project

## Local Development Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/agent_platform
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3
GROK_API_KEY=your_grok_api_key
GROK_API_URL=https://api.grok.com/v1
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
HUGGINGFACE_API_KEY=your_huggingface_api_key
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_API_URL=https://api.mistral.ai/v1
PORT=5000
```

Create a `.env.local` file in the frontend directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
