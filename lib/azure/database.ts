// Client-side database interface - no actual database imports
// This file provides type definitions and interfaces for client-side use

export interface DatabaseConfig {
  server: string
  database: string
  user: string
  password: string
}

export interface QueryResult {
  recordset: any[]
  rowsAffected: number[]
}

// Mock functions for client-side (these will be replaced by API calls)
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  throw new Error('Database queries not available on client side - use API calls instead')
}

export async function transaction<T>(callback: (request: any) => Promise<T>): Promise<T> {
  throw new Error('Database transactions not available on client side - use API calls instead')
}

export async function initializeDatabase(): Promise<void> {
  throw new Error('Database initialization not available on client side - use API calls instead')
}