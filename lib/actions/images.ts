'use server'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/lib/db'
import { recordImages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getEnv() {
  const { env } = await getCloudflareContext()
  return env
}

async function db() {
  const env = await getEnv()
  return getDb(env.DB)
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function getImagesByRecordId(recordId: string) {
  const d = await db()
  return d
    .select()
    .from(recordImages)
    .where(eq(recordImages.recordId, recordId))
    .orderBy(desc(recordImages.createdAt))
}

export async function uploadRecordImage(recordId: string, formData: FormData) {
  const file = formData.get('file') as File | null
  const description = (formData.get('description') as string) || null

  if (!file || file.size === 0) {
    throw new Error('No se seleccionó ningún archivo')
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Use JPG, PNG, WebP o GIF.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('El archivo excede el tamaño máximo de 10MB')
  }

  const env = await getEnv()
  const d = getDb(env.DB)

  // Generate unique R2 key
  const ext = file.name.split('.').pop() || 'jpg'
  const imageId = crypto.randomUUID()
  const r2Key = `records/${recordId}/${imageId}.${ext}`

  // Upload to R2
  const arrayBuffer = await file.arrayBuffer()
  await env.IMAGES_BUCKET.put(r2Key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
    customMetadata: { recordId, originalName: file.name },
  })

  // Save metadata to D1
  const result = await d
    .insert(recordImages)
    .values({
      recordId,
      r2Key,
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
      description,
    })
    .returning()

  revalidatePath(`/records/${recordId}`)
  return result[0]
}

export async function deleteRecordImage(imageId: string) {
  const env = await getEnv()
  const d = getDb(env.DB)

  // Get the image metadata first
  const images = await d
    .select()
    .from(recordImages)
    .where(eq(recordImages.id, imageId))

  const image = images[0]
  if (!image) throw new Error('Imagen no encontrada')

  // Delete from R2
  await env.IMAGES_BUCKET.delete(image.r2Key)

  // Delete metadata from D1
  await d.delete(recordImages).where(eq(recordImages.id, imageId))

  revalidatePath(`/records/${image.recordId}`)
  return { success: true }
}

export async function getImageUrl(imageId: string): Promise<string> {
  // Images are served via the /api/images/[id] route
  return `/api/images/${imageId}`
}
