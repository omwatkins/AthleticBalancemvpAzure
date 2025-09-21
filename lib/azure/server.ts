import { cookies } from 'next/headers'
import { AuthService, User } from './auth'
import { query } from './database-server'

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

// Server-side Azure client (replaces Supabase server client)
export async function createClient() {
  const cookieStore = await cookies()
  
  return {
    auth: {
      getUser: async () => {
        try {
          // Get token from cookies
          const token = cookieStore.get('auth_token')?.value
          
          if (!token) {
            return { data: { user: null }, error: new Error('No token found') }
          }

          const result = await AuthService.getUserFromToken(token)
          return { data: { user: result.user }, error: result.error ? new Error(result.error) : null }
        } catch (error) {
          return { data: { user: null }, error: error as Error }
        }
      }
    },

    from: (table: string) => ({
      select: (columns: string) => ({
        eq: async (column: string, value: any) => {
          try {
            const sql = `SELECT ${columns} FROM ${table} WHERE ${column} = @param0`
            const result = await query(sql, [value])
            return { data: result.recordset, error: null }
          } catch (error) {
            return { data: null, error: error as Error }
          }
        },
        
        order: (column: string, options: { ascending?: boolean } = {}) => ({
          limit: async (count: number) => {
            try {
              const orderDirection = options.ascending ? 'ASC' : 'DESC'
              const sql = `SELECT TOP ${count} ${columns} FROM ${table} ORDER BY ${column} ${orderDirection}`
              const result = await query(sql)
              return { data: result.recordset, error: null }
            } catch (error) {
              return { data: null, error: error as Error }
            }
          }
        })
      }),

      insert: async (data: any) => {
        try {
          const columns = Object.keys(data).join(', ')
          const values = Object.values(data)
          const placeholders = values.map((_, i) => `@param${i}`).join(', ')
          
          const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}); SELECT SCOPE_IDENTITY() as id;`
          const result = await query(sql, values)
          return { data: result.recordset[0], error: null }
        } catch (error) {
          return { data: null, error: error as Error }
        }
      },

      upsert: async (data: any, options?: { onConflict?: string }) => {
        try {
          const columns = Object.keys(data).join(', ')
          const values = Object.values(data)
          const placeholders = values.map((_, i) => `@param${i}`).join(', ')
          
          let sql = `MERGE ${table} AS target USING (VALUES (${placeholders})) AS source (${columns}) ON target.${options?.onConflict || 'id'} = source.${options?.onConflict || 'id'}`
          
          if (options?.onConflict) {
            const updateColumns = Object.keys(data).filter(key => key !== options.onConflict)
            const updateClause = updateColumns.map(col => `target.${col} = source.${col}`).join(', ')
            sql += ` WHEN MATCHED THEN UPDATE SET ${updateClause} WHEN NOT MATCHED THEN INSERT (${columns}) VALUES (${placeholders});`
          } else {
            sql += ` WHEN NOT MATCHED THEN INSERT (${columns}) VALUES (${placeholders});`
          }
          
          const result = await query(sql, values)
          return { data: result.recordset[0], error: null }
        } catch (error) {
          return { data: null, error: error as Error }
        }
      },

      update: async (data: any) => ({
        eq: async (column: string, value: any) => {
          try {
            const updateColumns = Object.keys(data).map((key, i) => `${key} = @param${i}`).join(', ')
            const values = [...Object.values(data), value]
            
            const sql = `UPDATE ${table} SET ${updateColumns} WHERE ${column} = @param${values.length - 1}; SELECT * FROM ${table} WHERE ${column} = @param${values.length - 1};`
            const result = await query(sql, values)
            return { data: result.recordset[0], error: null }
          } catch (error) {
            return { data: null, error: error as Error }
          }
        }
      }),

      delete: async () => ({
        eq: async (column: string, value: any) => {
          try {
            const sql = `DELETE FROM ${table} WHERE ${column} = @param0; SELECT * FROM ${table} WHERE ${column} = @param0;`
            const result = await query(sql, [value])
            return { data: result.recordset[0], error: null }
          } catch (error) {
            return { data: null, error: error as Error }
          }
        }
      })
    })
  }
}

export { createClient as createServerClient }