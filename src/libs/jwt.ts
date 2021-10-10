import { sign } from 'jsonwebtoken'

export const generateToken = (data: any = {}): string => {
  return sign(data, process.env.JWT_SECRET ?? 'secret')
}
