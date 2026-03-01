import { NextResponse, type NextRequest } from 'next/server'
// import { validateCfAccessToken } from '@/lib/auth/cf-access'

export async function middleware(request: NextRequest) {
  // Landing page is always public
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  // TODO: Re-enable Cloudflare Access authentication
  // For now, allow all requests with a default user
  const response = NextResponse.next()
  response.headers.set('x-cf-user-email', 'admin@historiaclinica.app')
  response.headers.set('x-cf-user-sub', 'default-user')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
