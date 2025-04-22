# Authentication System Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB 5+
- npm/yarn

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Configuration
1. Create `.env` file:
```env
JWT_SECRET=your-secure-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret
MONGO_URI=mongodb://localhost:27017/your-db
```

2. Set required environment variables:
- `JWT_SECRET` - For access token signing
- `JWT_REFRESH_SECRET` - For refresh token signing
- `MONGO_URI` - MongoDB connection string

## Running the Application
Start the development server:
```bash
npm run dev
```

For production:
```bash
npm run build
npm start
```

## Testing Authentication
1. Register a user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"securepassword"}'
```

2. Login to get tokens:
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"securepassword"}'
```

3. Use refresh token:
```bash
curl -X POST http://localhost:3000/users/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your-refresh-token"}'
```

## Docker Deployment
1. Build the image:
```bash
docker build -t auth-service .
```

2. Run the container:
```bash
docker run -p 3000:3000 \
  -e JWT_SECRET=your-secret \
  -e JWT_REFRESH_SECRET=your-refresh-secret \
  -e MONGO_URI=mongodb://host.docker.internal:27017/your-db \
  auth-service
```

## Security Recommendations
- Use HTTPS in production
- Rotate secrets regularly
- Implement rate limiting
- Monitor authentication logs
