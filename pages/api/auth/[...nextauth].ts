import { NextApiRequest, NextApiResponse } from 'next';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../../services/auth';
import UserModel from '../../../models/UserModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return res.json({
          documentation: {
            login: 'POST /api/auth/login with {email, password}',
            refresh: 'POST /api/auth/refresh with {refreshToken}',
          },
        });
      case 'POST':
        if (req.query.nextauth?.includes('login')) {
          const { email, password } = req.body;
          const user = await UserModel.findOne({ email });

          if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }

          const accessToken = generateToken(user.id);
          const refreshToken = generateRefreshToken(user.id);

          user.lastLogin = new Date();
          user.refreshToken = refreshToken;
          user.refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await user.save();

          return res.json({ user, accessToken, refreshToken });
        } else if (req.query.nextauth?.includes('refresh')) {
          const { refreshToken } = req.body;
          const decoded = verifyRefreshToken(refreshToken) as { userId: string };
          const user = await UserModel.findById(decoded.userId);

          if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
          }

          const newAccessToken = generateToken(user.id);
          return res.json({ accessToken: newAccessToken });
        }
        break;
      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
