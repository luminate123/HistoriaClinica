import { headers } from 'next/headers'

export interface CfUser {
  email: string
  sub: string
}

/**
 * Get the authenticated user's info from Cloudflare Access JWT.
 * The middleware validates the JWT and injects the user info as headers.
 * Returns null if not authenticated (should not happen behind middleware).
 */
export async function getUser(): Promise<CfUser | null> {
  const h = await headers()
  const email = h.get('x-cf-user-email')
  const sub = h.get('x-cf-user-sub')

  if (!email) return null

  return { email, sub: sub || email }
}

/**
 * Get the authenticated user's email. Throws if not authenticated.
 */
export async function requireUser(): Promise<CfUser> {
  const user = await getUser()
  if (!user) {
    throw new Error('No autenticado')
  }
  return user
}
