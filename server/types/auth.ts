// server/types/auth.ts
interface AuthUser {
  userId: string
  email: string
  displayName?: string
  emailVerified?: boolean
  isAdmin?: boolean
}
