import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/azure/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (token) {
      await AuthService.signOut(token)
    }

    // Create response
    const response = NextResponse.json({ success: true })

    // Clear auth token cookie
    response.cookies.delete('auth_token')

    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
