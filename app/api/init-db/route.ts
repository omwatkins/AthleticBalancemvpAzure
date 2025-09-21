import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/azure/database-server'

export async function POST() {
  try {
    await initializeDatabase()
    return NextResponse.json({ success: true, message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Database initialization failed:', error)
    return NextResponse.json(
      { success: false, error: 'Database initialization failed' },
      { status: 500 }
    )
  }
}
