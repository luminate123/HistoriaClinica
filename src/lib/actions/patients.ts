'use server'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/lib/db'
import { patients } from '@/lib/db/schema'
import type { NewPatient } from '@/lib/db/schema'
import { eq, desc, sql, like, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function db() {
  const { env } = await getCloudflareContext()
  return getDb(env.DB)
}

export async function getPatients() {
  const d = await db()
  return d.select().from(patients).orderBy(desc(patients.createdAt))
}

export async function getPatientsCount() {
  const d = await db()
  const result = await d.select({ count: sql<number>`count(*)` }).from(patients)
  return result[0].count
}

export async function getRecentPatients(limit = 5) {
  const d = await db()
  return d.select().from(patients).orderBy(desc(patients.createdAt)).limit(limit)
}

export async function getPatientById(id: string) {
  const d = await db()
  const result = await d.select().from(patients).where(eq(patients.id, id))
  return result[0] || null
}

export async function getPatientsForSelect() {
  const d = await db()
  return d.select().from(patients).orderBy(patients.firstName)
}

export async function createPatient(data: Omit<NewPatient, 'id' | 'createdAt' | 'updatedAt'>) {
  const d = await db()
  const result = await d.insert(patients).values(data).returning()
  const patient = result[0]
  revalidatePath('/patients')
  revalidatePath('/dashboard')
  redirect(`/patients/${patient.id}`)
}

export async function deletePatient(id: string) {
  const d = await db()
  await d.delete(patients).where(eq(patients.id, id))
  revalidatePath('/patients')
  revalidatePath('/dashboard')
  redirect('/patients')
}
