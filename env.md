# Environment Variables for Agent Creation Platform

## Frontend Environment Variables
NEXT_PUBLIC_API_URL=https://agent-platform-backend.vercel.app

## Backend Environment Variables
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agent_platform
REDIS_URL=redis://<username>:<password>@<host>:<port>
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx

## Instructions for Setting Up Environment Variables in Vercel

### Backend Deployment
1. Create a new project in Vercel and link it to your backend repository
2. Go to Settings > Environment Variables
3. Add the following environment variables:
   - MONGO_URI: Your MongoDB connection string
   - REDIS_URL: Your Redis connection string
   - OPENAI_API_KEY: Your OpenAI API key
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
```

Create a `.env.local` file in the frontend directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
