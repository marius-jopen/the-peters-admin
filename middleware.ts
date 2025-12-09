import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // In production with Cloudflare Access, authentication is handled automatically
  // Cloudflare Access adds headers to verify the user is authenticated
  
  const cfAccessJwtAssertion = request.headers.get('cf-access-jwt-assertion')
  
  // In development, bypass authentication
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }
  
  // In production, check for Cloudflare Access JWT
  if (!cfAccessJwtAssertion) {
    // If no JWT is present, it means Cloudflare Access hasn't authenticated the user
    // This should not happen if Access is properly configured
    return new NextResponse('Unauthorized', { status: 401 })
  }
  
  // User is authenticated via Cloudflare Access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

