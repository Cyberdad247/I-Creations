import jwt from 'jsonwebtoken'
import UserModel from '@models/UserModel'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret'

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET)
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials')
  }
  return generateToken(user.id)
}
