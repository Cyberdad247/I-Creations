 import express, { Response, Router } from 'express';
import { AuthenticatedRequest } from './middlewares/authMiddleware';
import UserModel from './models/UserModel';
import { authenticateUser, generateToken, generateRefreshToken, verifyRefreshToken } from './auth_service';
import { authenticate, authorize } from './middlewares/authMiddleware';

interface UserRequest extends AuthenticatedRequest {
  body: {
    email?: string;
    password?: string;
    userId?: string;
  };
}

const router = express.Router();

// Error handler middleware
const handleError = (res: Response, error: unknown) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};

// Get all users (admin only)
router.get('/', authenticate, authorize(['admin']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Get user by ID (authenticated users)
router.get('/:id', authenticate, async (req: AuthenticatedRequest<{id: string}>, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Create new user
router.post('/', async (req: UserRequest, res: Response) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

// Update user (admin or same user)
router.put('/:id', authenticate, async (req: AuthenticatedRequest<{id: string}>, res: Response) => {
    // Check if user is admin or updating their own profile
    if (req.user?.role !== 'admin' && req.user?.id !== req.params.id) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, authorize(['admin']), async (req: AuthenticatedRequest<{id: string}>, res: Response) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// User login with JWT authentication
router.post('/login', async (req: UserRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    
    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    await user.save();
    
    res.json({
      user,
      accessToken,
      refreshToken
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
});

// Token refresh endpoint
router.post('/refresh', async (req: {body: {refreshToken: string}}, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken) as {userId: string};
    const user = await UserModel.findById(decoded.userId);
    
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    const newAccessToken = generateToken(user.id);
    res.json({ accessToken: newAccessToken });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
});

// Navigation endpoint for API discovery
router.get('/api/navigation', (req, res) => {
  res.json({
    routes: [
      { name: 'Users', path: '/api/users' },
      { name: 'Test Cases', path: '/api/test-cases' },
      { name: 'Agents', path: '/api/agents' }
    ]
  });
});

export default router;
