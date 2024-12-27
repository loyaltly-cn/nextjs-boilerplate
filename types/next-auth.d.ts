import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string
      image: string | null
      isAdmin: boolean
    }
  }

  interface User {
    id: string
    name: string | null
    email: string
    image: string | null
    isAdmin: boolean
  }
} 