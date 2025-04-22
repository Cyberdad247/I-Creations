# Vercel Deployment Guide for Agent Creation Platform

This guide provides detailed instructions for deploying the Agent Creation Platform to Vercel. The platform consists of two main components that need to be deployed separately:

1. Backend API (Express.js)
2. Frontend Application (Next.js)

## Prerequisites

Before you begin, you'll need:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: For hosting your repositories
3. **MongoDB Atlas Account**: For database hosting ([mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
4. **Redis Cloud Account**: For caching ([redis.com/try-free](https://redis.com/try-free/))
5. **OpenAI API Key**: For AI capabilities ([platform.openai.com](https://platform.openai.com))

## Step 1: Set Up MongoDB Atlas

1. **Create a MongoDB Atlas Cluster**:
   - Sign in to MongoDB Atlas
   - Create a new project
   - Build a new cluster (the free tier is sufficient for starting)
   - Choose your preferred cloud provider and region

2. **Configure Database Access**:
   - Create a database user with read/write permissions
   - Note down the username and password

3. **Configure Network Access**:
   - Add `0.0.0.0/0` to IP Access List to allow connections from anywhere (including Vercel)
   - For production, you may want to restrict this later

4. **Get Connection String**:
   - Go to "Connect" > "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user's password
   - Replace `myFirstDatabase` with `agent_platform`

## Step 2: Set Up Redis Cloud

1. **Create a Redis Cloud Database**:
   - Sign in to Redis Cloud
   - Create a new subscription (the free tier is sufficient for starting)
   - Create a new database within your subscription

2. **Get Connection Details**:
   - Note down the endpoint (host:port)
   - Note down the password
   - Construct your Redis URL: `redis://default:<password>@<host>:<port>`

## Step 3: Prepare OpenAI API Key

1. **Get API Key**:
   - Sign in to OpenAI platform
   - Navigate to API keys section
   - Create a new secret key
   - Copy and securely store this key

## Step 4: Deploy Backend to Vercel

1. **Create GitHub Repository for Backend**:
   - Create a new repository on GitHub
   - Push the backend code to this repository

2. **Import Project to Vercel**:
   - Sign in to Vercel
   - Click "Add New" > "Project"
   - Import your backend GitHub repository
   - Configure the project:
     - Framework Preset: Other
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: dist
     - Install Command: `npm install`

3. **Configure Environment Variables**:
   - In the Vercel project settings, add the following environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `REDIS_URL`: Your Redis Cloud connection string
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `NODE_ENV`: `production`

4. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Note down the deployment URL (e.g., `https://agent-platform-backend.vercel.app`)

## Step 5: Deploy Frontend to Vercel

1. **Update API URL in Frontend**:
   - Open `frontend/vercel.json`
   - Update the `rewrites` section to point to your backend URL:
     ```json
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-url.vercel.app/api/:path*"
       }
     ]
     ```
   - Update the `env` section with your backend URL:
     ```json
     "env": {
       "NEXT_PUBLIC_API_URL": "https://your-backend-url.vercel.app"
     }
     ```

2. **Create GitHub Repository for Frontend**:
   - Create a new repository on GitHub
   - Push the frontend code to this repository

3. **Import Project to Vercel**:
   - Sign in to Vercel
   - Click "Add New" > "Project"
   - Import your frontend GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
     - Install Command: `npm install`

4. **Configure Environment Variables**:
   - In the Vercel project settings, add the following environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend deployment URL

5. **Deploy**:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Note down the deployment URL (e.g., `https://agent-platform.vercel.app`)

## Step 6: Verify Deployment

1. **Test Backend API**:
   - Visit `https://your-backend-url.vercel.app/api/health`
   - You should see a response indicating the server is running

2. **Test Frontend Application**:
   - Visit your frontend deployment URL
   - You should see the Agent Creation Platform interface
   - Try logging in with the default credentials:
     - Email: `admin@example.com`
     - Password: `password` (you should change this immediately)

3. **Test API Connection**:
   - Create a new agent through the interface
   - If successful, this confirms the frontend can communicate with the backend

## Step 7: Set Up Custom Domain (Optional)

1. **Add Custom Domain to Vercel Project**:
   - In your Vercel project settings, go to "Domains"
   - Add your custom domain
   - Follow the verification steps

2. **Update API URL**:
   - If you added a custom domain to your backend, update the frontend environment variables to use this domain

## Troubleshooting

### Backend Deployment Issues

1. **Database Connection Errors**:
   - Verify your MongoDB connection string is correct
   - Ensure your IP access list in MongoDB Atlas includes `0.0.0.0/0`
   - Check if your database user has the correct permissions

2. **Redis Connection Errors**:
   - Verify your Redis URL is correct
   - Ensure your Redis database is accessible from external sources

3. **Build Errors**:
   - Check the build logs in Vercel
   - Ensure all dependencies are correctly listed in package.json

### Frontend Deployment Issues

1. **API Connection Errors**:
   - Verify the `NEXT_PUBLIC_API_URL` environment variable is set correctly
   - Check that the backend API is running and accessible
   - Verify the rewrites in vercel.json are correctly configured

2. **Build Errors**:
   - Check the build logs in Vercel
   - Ensure all dependencies are correctly listed in package.json

## Maintenance

1. **Updating Your Deployment**:
   - Push changes to your GitHub repository
   - Vercel will automatically rebuild and redeploy your application

2. **Monitoring**:
   - Use Vercel Analytics to monitor your application performance
   - Set up alerts for deployment failures

3. **Scaling**:
   - As your usage grows, you may need to upgrade your MongoDB Atlas and Redis Cloud plans
   - Consider using Vercel Pro for production deployments with higher limits

## Security Considerations

1. **API Keys**:
   - Regularly rotate your OpenAI API key
   - Use environment variables for all sensitive information
   - Never commit API keys or passwords to your repository

2. **Database Security**:
   - Regularly update your database user passwords
   - Restrict IP access when possible
   - Enable MongoDB Atlas backups

3. **User Authentication**:
   - Implement proper authentication for production use
   - Change default admin credentials immediately
   - Consider adding OAuth or other secure authentication methods

## Next Steps

After successful deployment, consider:

1. **Setting up CI/CD** for automated testing before deployment
2. **Implementing user authentication** for production use
3. **Adding monitoring and alerting** for system health
4. **Creating regular backup procedures** for your database
5. **Developing a scaling strategy** as your usage grows
