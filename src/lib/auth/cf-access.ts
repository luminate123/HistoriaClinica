import { jwtVerify, createRemoteJWKSet } from 'jose'

export interface CfAccessPayload {
  email: string
  sub: string
  iss: string
  aud: string[]
  iat: number
  exp: number
}

/**
 * Validate a Cloudflare Access JWT token.
 * Returns the payload if valid, null if invalid.
 */
export async function validateCfAccessToken(
  token: string,
  teamDomain: string,
  aud: string
): Promise<CfAccessPayload | null> {
  try {
    const JWKS = createRemoteJWKSet(
      new URL(`https://${teamDomain}/cdn-cgi/access/certs`)
    )

    const { payload } = await jwtVerify(token, JWKS, {
      audience: aud,
      issuer: `https://${teamDomain}`,
    })

    return payload as unknown as CfAccessPayload
  } catch {
    return null
  }
}
