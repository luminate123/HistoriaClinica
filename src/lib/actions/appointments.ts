'use server'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getDb } from '@/lib/db'
import { appointments, patients } from '@/lib/db/schema'
import type { NewAppointment } from '@/lib/db/schema'
import { eq, desc, sql, and, gte, lt } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function db() {
  const { env } = await getCloudflareContext()
  return getDb(env.DB)
}

export async function getAppointments() {
  const d = await db()
  return d
    .select()
    .from(appointments)
    .leftJoin(patients, eq(appointments.patientId, patients.id))
    .orderBy(appointments.appointmentDate)
}

export async function getTodayAppointmentsCount() {
  const d = await db()
  const today = new Date().toISOString().split('T')[0]
  const result = await d
    .select({ count: sql<number>`count(*)` })
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, today),
        lt(appointments.appointmentDate, `${today}T23:59:59`)
      )
    )
  return result[0].count
}

export async function createAppointment(
  data: Omit<NewAppointment, 'id' | 'createdAt' | 'updatedAt'>
) {
  const d = await db()
  await d.insert(appointments).values(data)
  revalidatePath('/appointments')
  revalidatePath('/dashboard')
  redirect('/appointments')
}

export async function updateAppointmentStatus(id: string, status: 'scheduled' | 'completed' | 'cancelled') {
  const d = await db()
  await d
    .update(appointments)
    .set({ status, updatedAt: sql`(datetime('now'))` })
    .where(eq(appointments.id, id))
  revalidatePath('/appointments')
  revalidatePath('/dashboard')
}

export async function deleteAppointment(id: string) {
  const d = await db()
  await d.delete(appointments).where(eq(appointments.id, id))
  revalidatePath('/appointments')
  revalidatePath('/dashboard')
  redirect('/appointments')
}
