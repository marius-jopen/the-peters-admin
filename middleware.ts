import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // TODO: Setup Cloudflare Access for production!
  // For now, allowing access for testing
  // IMPORTANT: Enable Cloudflare Access before going live!
  
  // Temporarily disabled for setup - ENABLE CLOUDFLARE ACCESS ASAP!
  return NextResponse.next()
  
  /* Uncomment this after setting up Cloudflare Access:
  
  const cfAccessJwtAssertion = request.headers.get('cf-access-jwt-assertion')
  
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }
  
  if (!cfAccessJwtAssertion) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  
  return NextResponse.next()
  */
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

