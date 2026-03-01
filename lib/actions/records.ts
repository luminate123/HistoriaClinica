'use server'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/lib/db'
import { medicalRecords, patients, recordImages } from '@/lib/db/schema'
import type { NewMedicalRecord } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth/get-user'

async function db() {
  const { env } = await getCloudflareContext()
  return getDb(env.DB)
}

export async function getRecords() {
  const d = await db()
  return d
    .select()
    .from(medicalRecords)
    .leftJoin(patients, eq(medicalRecords.patientId, patients.id))
    .orderBy(desc(medicalRecords.visitDate))
}

export async function getRecordsCount() {
  const d = await db()
  const result = await d.select({ count: sql<number>`count(*)` }).from(medicalRecords)
  return result[0].count
}

export async function getRecordById(id: string) {
  const d = await db()
  const result = await d.select().from(medicalRecords).where(eq(medicalRecords.id, id))
  return result[0] || null
}

export async function getRecordsByPatientId(patientId: string) {
  const d = await db()
  return d
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.patientId, patientId))
    .orderBy(desc(medicalRecords.visitDate))
}

export async function createRecord(
  data: Omit<NewMedicalRecord, 'id' | 'createdAt' | 'updatedAt' | 'createdByEmail'>
) {
  const user = await requireUser()
  const d = await db()
  const result = await d
    .insert(medicalRecords)
    .values({ ...data, createdByEmail: user.email })
    .returning()
  const record = result[0]
  revalidatePath('/records')
  revalidatePath('/dashboard')
  revalidatePath(`/patients/${data.patientId}`)
  redirect(`/records/${record.id}`)
}

export async function deleteRecord(id: string) {
  const { env } = await getCloudflareContext()
  const d = getDb(env.DB)
  const record = await d.select().from(medicalRecords).where(eq(medicalRecords.id, id))

  // Delete associated images from R2
  const images = await d.select().from(recordImages).where(eq(recordImages.recordId, id))
  for (const img of images) {
    await env.IMAGES_BUCKET.delete(img.r2Key)
  }

  await d.delete(medicalRecords).where(eq(medicalRecords.id, id))
  revalidatePath('/records')
  revalidatePath('/dashboard')
  if (record[0]) {
    revalidatePath(`/patients/${record[0].patientId}`)
  }
  redirect('/records')
}
