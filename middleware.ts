import { NextResponse, type NextRequest } from 'next/server'
import { validateCfAccessToken } from '@/lib/auth/cf-access'

const isDev = process.env.NODE_ENV === 'development'

export async function middleware(request: NextRequest) {
  // Landing page is always public
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  // In development, skip CF Access validation and inject a mock user
  if (isDev) {
    const response = NextResponse.next()
    response.headers.set('x-cf-user-email', 'dev@localhost')
    response.headers.set('x-cf-user-sub', 'dev-local-user')
    return response
  }

  // In production, validate Cloudflare Access JWT
  const token =
    request.headers.get('Cf-Access-Jwt-Assertion') ||
    request.cookies.get('CF_Authorization')?.value ||
    ''

  if (!token) {
    return new NextResponse('Acceso no autorizado', { status: 403 })
  }

  const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN || ''
  const aud = process.env.CF_ACCESS_AUD || ''

  const payload = await validateCfAccessToken(token, teamDomain, aud)

  if (!payload) {
    return new NextResponse('Token inválido o expirado', { status: 403 })
  }

  // Inject user info into request headers for Server Components to read
  const response = NextResponse.next()
  response.headers.set('x-cf-user-email', payload.email)
  response.headers.set('x-cf-user-sub', payload.sub)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
