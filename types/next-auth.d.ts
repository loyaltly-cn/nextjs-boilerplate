import 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string | null
    isAdmin: boolean
    image?: string | null
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name: string | null
      isAdmin: boolean
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string | null
    isAdmin: boolean
    image?: string | null
  }
} 