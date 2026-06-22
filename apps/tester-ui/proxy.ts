import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')

  if (!sessionId) {
    try {
      // Call the analytics-api to initialize a session
      const response = await fetch('http://localhost:1351/session/init', {
        method: 'GET',
      })

      if (response.ok) {
        const nextResponse = NextResponse.next()
        const setCookieHeader = response.headers.get('set-cookie')

        if (setCookieHeader) {
          // Forward the Set-Cookie header to the browser
          nextResponse.headers.set('Set-Cookie', setCookieHeader)
        }

        return nextResponse
      }
    } catch (error) {
      console.error('Failed to initialize session in middleware:', error)
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
