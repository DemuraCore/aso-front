import { jwtDecode } from 'jwt-decode'

interface JWTClaims {
  user_id: number
  exp: number
}

export function decodeJWT(token: string): JWTClaims | null {
  try {
    const decoded = jwtDecode<JWTClaims>(token)
    return decoded
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded) return true

  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTime
}
