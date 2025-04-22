# Frontend-Backend Connection Guide

This guide provides detailed instructions for connecting the frontend and backend components of the Agent Creation Platform when deployed on Vercel.

## Overview

The Agent Creation Platform consists of two separate applications:
1. **Frontend**: Next.js application that provides the user interface
2. **Backend**: Express.js API that handles data processing and AI operations

For these components to work together, they must be properly connected through API endpoints.

## Configuration Steps

### 1. Update Frontend Configuration

#### Update `vercel.json`

The frontend's `vercel.json` file needs to be configured to properly route API requests to your backend:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.vercel.app/api/:path*"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-backend-url.vercel.app"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://your-backend-url.vercel.app"
    }
  }
}
```

Replace `your-backend-url.vercel.app` with your actual backend deployment URL.

#### Update Environment Variables

Ensure the `NEXT_PUBLIC_API_URL` environment variable is set correctly:

1. In your local development environment:
   - Update `.env.local` with `NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app`

2. In Vercel:
   - Go to your frontend project settings
   - Navigate to "Environment Variables"
   - Add or update `NEXT_PUBLIC_API_URL` with your backend URL

### 2. Configure CORS on Backend

The backend needs to accept requests from your frontend domain:

1. Ensure the CORS configuration in `backend/src/index.ts` is properly set up:

```typescript
// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

Replace `your-frontend-url.vercel.app` with your actual frontend deployment URL.

2. Update this configuration in your deployed backend:
   - Update the code in your repository
   - Redeploy the backend to Vercel

### 3. Test API Connectivity

After deployment, verify that the frontend can communicate with the backend:

1. **Health Check Endpoint**:
   - Visit `https://your-backend-url.vercel.app/api/health` directly in your browser
   - You should see a response indicating the server is running

2. **Frontend API Test**:
   - Visit your frontend application
   - Open browser developer tools (F12)
   - Go to the Network tab
   - Perform an action that triggers an API call (e.g., loading the dashboard)
   - Verify that requests to `/api/*` endpoints are successful (status 200)

## Common Connection Issues

### CORS Errors

If you see errors like "Access to fetch at 'X' from origin 'Y' has been blocked by CORS policy":

1. Verify the CORS configuration in your backend
2. Ensure the frontend URL is correctly listed in the allowed origins
3. Check for protocol mismatches (http vs https)
4. Verify that credentials handling is consistent

### 404 Not Found Errors

If API endpoints return 404 errors:

1. Verify the API routes are correctly implemented in the backend
2. Check that the frontend is using the correct API URL
3. Ensure the path in API requests matches the routes defined in the backend
4. Verify the rewrites in `vercel.json` are correctly configured

### Authentication Issues

If you encounter authentication problems:

1. Check that any authentication tokens are being properly passed in requests
2. Verify that cookies or localStorage are being used correctly
3. Ensure that the backend is correctly validating authentication

## Advanced Configuration

### Custom Domains

If you're using custom domains for your frontend and/or backend:

1. Update all configuration to use these custom domains
2. Ensure SSL certificates are properly configured
3. Update CORS settings to allow requests from your custom domain

### API Proxying

For more complex setups, you might want to use Next.js API routes to proxy requests:

1. Create API routes in `pages/api/` or `app/api/`
2. Forward requests to your backend
3. This can help avoid CORS issues and provide a unified domain for all requests

Example API route (`pages/api/[...path].js`):

```javascript
export default async function handler(req, res) {
  const { path } = req.query;
  const apiUrl = `${process.env.BACKEND_URL}/api/${path.join('/')}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization headers if needed
        ...(req.headers.authorization && { 
          'Authorization': req.headers.authorization 
        })
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' 
        ? JSON.stringify(req.body) 
        : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
```

## Monitoring Connection Health

To ensure ongoing connectivity between your frontend and backend:

1. Implement a simple health check in your frontend that periodically pings the backend
2. Set up alerts for connection failures
3. Monitor API response times and error rates
4. Use Vercel Analytics to track performance metrics

## Troubleshooting Checklist

If you encounter connection issues:

1. Verify environment variables are correctly set
2. Check CORS configuration
3. Inspect network requests in browser developer tools
4. Verify API endpoints are correctly implemented
5. Check for any firewall or security restrictions
6. Ensure both applications are successfully deployed
7. Verify domain configurations and SSL certificates
