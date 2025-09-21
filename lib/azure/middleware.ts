import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const token = request.cookies.get('auth_token')?.value

  if (token) {
    try {
      // Basic token validation (decode without verification for middleware)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      
      if (payload.exp && payload.exp > now) {
        // Token is valid, user is authenticated
        // You might want to refresh the token here if it's close to expiry
      } else {
        // Token is expired, clear it
        response.cookies.delete('auth_token')
      }
    } catch (error) {
      // Token is invalid, clear it
      response.cookies.delete('auth_token')
    }
  }

  // Protect authenticated routes
  const protectedRoutes = ["/dashboard", "/coaches", "/profile", "/chat"]
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages
  if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}