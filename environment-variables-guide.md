# Environment Variables Configuration Guide

This guide provides detailed instructions for setting up the environment variables required for the Agent Creation Platform. Proper configuration of these variables is essential for the platform to function correctly.

## Backend Environment Variables

Create a `.env` file in the root of your backend project with the following variables:

```
# Node.js environment
NODE_ENV=production

# MongoDB connection string
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/agent_platform
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/agent_platform

# Redis connection string
# Format: redis://default:<password>@<host>:<port>
REDIS_URL=redis://default:your_password@your_host:your_port

# OpenAI API key
OPENAI_API_KEY=sk-your_openai_api_key

# Server port (optional, defaults to 5000)
PORT=5000
```

### Variable Details

1. **NODE_ENV**
   - Set to `production` for deployment
   - Set to `development` for local development

2. **MONGO_URI**
   - Obtain from MongoDB Atlas dashboard
   - Replace `your_username`, `your_password`, and `your_cluster` with your actual MongoDB Atlas credentials
   - The database name should be `agent_platform`

3. **REDIS_URL**
   - Obtain from Redis Cloud dashboard
   - Replace `your_password`, `your_host`, and `your_port` with your actual Redis Cloud credentials

4. **OPENAI_API_KEY**
   - Obtain from OpenAI platform
   - Replace `your_openai_api_key` with your actual OpenAI API key

5. **PORT** (optional)
   - Defaults to 5000 if not specified
   - When deployed to Vercel, this is handled automatically

## Frontend Environment Variables

Create a `.env.local` file in the root of your frontend project with the following variables:

```
# Backend API URL
# Format: https://your-backend-url.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
```

### Variable Details

1. **NEXT_PUBLIC_API_URL**
   - The URL of your deployed backend API
   - Replace `your-backend-url.vercel.app` with your actual backend deployment URL
   - For local development, use `http://localhost:5000`

## Vercel Environment Variables

When deploying to Vercel, you'll need to add these environment variables in the Vercel project settings:

### Backend Project

1. Navigate to your backend project in Vercel
2. Go to Settings > Environment Variables
3. Add the following variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `REDIS_URL`: Your Redis Cloud connection string
   - `OPENAI_API_KEY`: Your OpenAI API key

### Frontend Project

1. Navigate to your frontend project in Vercel
2. Go to Settings > Environment Variables
3. Add the following variable:
   - `NEXT_PUBLIC_API_URL`: Your backend deployment URL

## Security Considerations

1. **Never commit your `.env` or `.env.local` files to version control**
   - Add them to your `.gitignore` file

2. **Regularly rotate your API keys**
   - Especially your OpenAI API key

3. **Use environment-specific variables**
   - Different values for development, testing, and production

4. **Restrict access to your environment variables**
   - Only share with team members who need access

## Troubleshooting

### Common Issues

1. **Connection Errors**
   - Verify your connection strings are correct
   - Check for typos or missing characters

2. **Authentication Failures**
   - Ensure your usernames and passwords are correct
   - Verify your API keys are active and have the necessary permissions

3. **Missing Variables**
   - Check that all required variables are defined
   - Verify the variable names match exactly (they are case-sensitive)

### Verifying Configuration

To verify your environment variables are correctly configured:

1. **Backend**
   - Add a temporary route that returns `process.env.NODE_ENV` (but not sensitive variables)
   - Check the logs in Vercel for any environment-related errors

2. **Frontend**
   - Add a temporary component that displays `process.env.NEXT_PUBLIC_API_URL`
   - Check the browser console for any environment-related errors

## Local Development vs. Production

It's recommended to maintain separate `.env` files for different environments:

1. **Local Development**
   - `.env.development` for backend
   - `.env.local` for frontend

2. **Production**
   - Configure through Vercel environment variables

This separation helps prevent accidental use of production resources during development.
