import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/lib/db'
import { recordImages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { env } = await getCloudflareContext()
    const d = getDb(env.DB)

    const images = await d
      .select()
      .from(recordImages)
      .where(eq(recordImages.id, id))

    const image = images[0]
    if (!image) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const object = await env.IMAGES_BUCKET.get(image.r2Key)
    if (!object) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const headers = new Headers()
    headers.set('Content-Type', image.contentType)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Content-Length', String(image.sizeBytes))

    return new Response(object.body, { headers })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
