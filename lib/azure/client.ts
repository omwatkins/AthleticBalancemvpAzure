import { User } from './auth'

export interface CoachSession {
  id: string
  title: string
  coach_id: string
  created_at: string
  coaches: {
    name: string
    emoji: string
  }
}

export interface Coach {
  id: string
  name: string
  emoji: string
  tagline: string
  system_prompt: string
  created_at: string
}

// Client-side Azure client (replaces Supabase browser client)
export class AzureClient {
  private token: string | null = null

  constructor() {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  // Auth methods
  get auth() {
    return {
      getUser: async () => {
        try {
          const response = await fetch('/api/auth/user', {
            method: 'GET',
            credentials: 'include',
          })

          const data = await response.json()

          if (!response.ok) {
            return { data: { user: null }, error: new Error(data.error || 'Failed to get user') }
          }

          return { data: { user: data.user }, error: null }
        } catch (error) {
          return { data: { user: null }, error: error as Error }
        }
      },

      signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            return { data: { user: null }, error: new Error(data.error || 'Failed to create account') }
          }

          return { data: { user: data.user }, error: null }
        } catch (error) {
          return { data: { user: null }, error: error as Error }
        }
      },

      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        try {
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            return { data: { user: null }, error: new Error(data.error || 'Invalid credentials') }
          }

          return { data: { user: data.user }, error: null }
        } catch (error) {
          return { data: { user: null }, error: error as Error }
        }
      },

      signInWithOAuth: async ({ provider, options }: { provider: string; options?: any }) => {
        // This would integrate with OAuth providers like Google
        // For now, return an error as this needs proper OAuth setup
        return { data: { user: null }, error: new Error('OAuth not implemented yet') }
      },

      signOut: async () => {
        try {
          await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include',
          })
          
          return { error: null }
        } catch (error) {
          return { error: error as Error }
        }
      }
    }
  }

  // Database query methods (using API calls)
  from(table: string) {
    return {
      select: (columns: string) => ({
        eq: async (column: string, value: any) => {
          try {
            const response = await fetch(`/api/data/${table}?${column}=${encodeURIComponent(value)}`, {
              method: 'GET',
              credentials: 'include',
            })

            const data = await response.json()

            if (!response.ok) {
              return { data: null, error: new Error(data.error || 'Failed to fetch data') }
            }

            return { data: data.results, error: null }
          } catch (error) {
            return { data: null, error: error as Error }
          }
        },
        
        order: (column: string, options: { ascending?: boolean } = {}) => ({
          limit: async (count: number) => {
            try {
              const orderDirection = options.ascending ? 'ASC' : 'DESC'
              const response = await fetch(
                `/api/data/${table}?order=${column}&direction=${orderDirection}&limit=${count}`,
                {
                  method: 'GET',
                  credentials: 'include',
                }
              )

              const data = await response.json()

              if (!response.ok) {
                return { data: null, error: new Error(data.error || 'Failed to fetch data') }
              }

              return { data: data.results, error: null }
            } catch (error) {
              return { data: null, error: error as Error }
            }
          }
        })
      }),

      insert: async (data: any) => {
        try {
          const response = await fetch(`/api/data/${table}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
          })

          const result = await response.json()

          if (!response.ok) {
            return { data: null, error: new Error(result.error || 'Failed to insert data') }
          }

          return { data: result.data, error: null }
        } catch (error) {
          return { data: null, error: error as Error }
        }
      },

      upsert: async (data: any, options?: { onConflict?: string }) => {
        try {
          const response = await fetch(`/api/data/${table}/upsert`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ data, options }),
          })

          const result = await response.json()

          if (!response.ok) {
            return { data: null, error: new Error(result.error || 'Failed to upsert data') }
          }

          return { data: result.data, error: null }
        } catch (error) {
          return { data: null, error: error as Error }
        }
      },

      update: async (data: any) => ({
        eq: async (column: string, value: any) => {
          try {
            const response = await fetch(`/api/data/${table}?${column}=${encodeURIComponent(value)}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
              return { data: null, error: new Error(result.error || 'Failed to update data') }
            }

            return { data: result.data, error: null }
          } catch (error) {
            return { data: null, error: error as Error }
          }
        }
      }),

      delete: async () => ({
        eq: async (column: string, value: any) => {
          try {
            const response = await fetch(`/api/data/${table}?${column}=${encodeURIComponent(value)}`, {
              method: 'DELETE',
              credentials: 'include',
            })

            const result = await response.json()

            if (!response.ok) {
              return { data: null, error: new Error(result.error || 'Failed to delete data') }
            }

            return { data: result.data, error: null }
          } catch (error) {
            return { data: null, error: error as Error }
          }
        }
      })
    }
  }
}

// Create and export a singleton instance
export const azureClient = new AzureClient()

// Export createClient function for compatibility with existing code
export function createClient() {
  return azureClient
}