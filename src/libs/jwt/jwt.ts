import { sign, verify } from 'jsonwebtoken'

export const generateToken = (data: any = {}): string => {
  return sign(data, process.env.JWT_SECRET ?? 'secret', { expiresIn: '7d' })
}

export const isTokenVerified = (token: string): boolean => {
  try {
    verify(token, process.env.JWT_SECRET ?? 'secret')
    return true
  } catch (err) {
    return false
  }
}
