import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/azure/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    const result = await AuthService.getUserFromToken(token)

    if (result.error || !result.user) {
      return NextResponse.json({ error: result.error || 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json({ user: result.user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
