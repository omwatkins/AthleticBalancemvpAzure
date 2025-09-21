import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query, transaction } from './database-server'

export interface User {
  id: string
  email: string
  email_verified: boolean
  created_at: string
  updated_at: string
  profile?: {
    full_name?: string
    age?: number
    sport?: string
    school?: string
  }
}

export interface AuthResult {
  user: User | null
  error?: string
}

export interface SignUpData {
  email: string
  password: string
  full_name?: string
}

export interface SignInData {
  email: string
  password: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export class AuthService {
  // Sign up with email and password
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { email, password, full_name } = data

      // Check if user already exists
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email])
      if (existingUser.rows.length > 0) {
        return { user: null, error: 'User already exists' }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12)

      // Create user in transaction
      const result = await transaction(async (client) => {
        // Insert user
        const userResult = await client.query(
          'INSERT INTO users (email, password_hash, email_verified) VALUES ($1, $2, $3) RETURNING *',
          [email, passwordHash, false]
        )

        const user = userResult.rows[0]

        // Insert profile
        await client.query(
          'INSERT INTO profiles (id, email, full_name) VALUES ($1, $2, $3)',
          [user.id, email, full_name]
        )

        return user
      })

      // Generate JWT token
      const token = jwt.sign({ userId: result.id, email: result.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      })

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      await query(
        'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [result.id, token, expiresAt]
      )

      return { user: { ...result, profile: { full_name } } }
    } catch (error) {
      console.error('Sign up error:', error)
      return { user: null, error: 'Failed to create account' }
    }
  }

  // Sign in with email and password
  static async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const { email, password } = data

      // Get user with password hash
      const userResult = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (userResult.rows.length === 0) {
        return { user: null, error: 'Invalid credentials' }
      }

      const user = userResult.rows[0]

      // Verify password
      if (!user.password_hash || !(await bcrypt.compare(password, user.password_hash))) {
        return { user: null, error: 'Invalid credentials' }
      }

      // Get user profile
      const profileResult = await query(
        'SELECT full_name, age, sport, school FROM profiles WHERE id = $1',
        [user.id]
      )

      const profile = profileResult.rows[0] || {}

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      })

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      await query(
        'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expiresAt]
      )

      return { user: { ...user, profile } }
    } catch (error) {
      console.error('Sign in error:', error)
      return { user: null, error: 'Failed to sign in' }
    }
  }

  // Verify JWT token and get user
  static async getUserFromToken(token: string): Promise<AuthResult> {
    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

      // Check if session exists and is valid
      const sessionResult = await query(
        'SELECT * FROM user_sessions WHERE token = $1 AND expires_at > NOW()',
        [token]
      )

      if (sessionResult.rows.length === 0) {
        return { user: null, error: 'Invalid or expired token' }
      }

      // Get user
      const userResult = await query('SELECT * FROM users WHERE id = $1', [decoded.userId])
      if (userResult.rows.length === 0) {
        return { user: null, error: 'User not found' }
      }

      const user = userResult.rows[0]

      // Get user profile
      const profileResult = await query(
        'SELECT full_name, age, sport, school FROM profiles WHERE id = $1',
        [user.id]
      )

      const profile = profileResult.rows[0] || {}

      return { user: { ...user, profile } }
    } catch (error) {
      console.error('Token verification error:', error)
      return { user: null, error: 'Invalid token' }
    }
  }

  // Sign out (remove session)
  static async signOut(token: string): Promise<void> {
    try {
      await query('DELETE FROM user_sessions WHERE token = $1', [token])
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await query('DELETE FROM user_sessions WHERE expires_at < NOW()')
    } catch (error) {
      console.error('Session cleanup error:', error)
    }
  }

  // OAuth provider sign in (placeholder for Google OAuth)
  static async signInWithProvider(provider: string, providerId: string, email: string, name?: string): Promise<AuthResult> {
    try {
      // Check if user exists with this provider
      let userResult = await query(
        'SELECT * FROM users WHERE provider = $1 AND provider_id = $2',
        [provider, providerId]
      )

      let user: any

      if (userResult.rows.length > 0) {
        // User exists, get their data
        user = userResult.rows[0]
      } else {
        // Create new user
        const newUserResult = await transaction(async (client) => {
          // Insert user
          const userInsert = await client.query(
            'INSERT INTO users (email, provider, provider_id, email_verified) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, provider, providerId, true]
          )

          const newUser = userInsert.rows[0]

          // Insert profile
          await client.query(
            'INSERT INTO profiles (id, email, full_name) VALUES ($1, $2, $3)',
            [newUser.id, email, name]
          )

          return newUser
        })

        user = newUserResult
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
      })

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      await query(
        'INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [user.id, token, expiresAt]
      )

      // Get profile
      const profileResult = await query(
        'SELECT full_name, age, sport, school FROM profiles WHERE id = $1',
        [user.id]
      )

      const profile = profileResult.rows[0] || {}

      return { user: { ...user, profile } }
    } catch (error) {
      console.error('OAuth sign in error:', error)
      return { user: null, error: 'Failed to sign in with provider' }
    }
  }
}
