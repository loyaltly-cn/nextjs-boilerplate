declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string
    email: string
    name?: string
    image?: string | null
    isAdmin: boolean
  }
} 