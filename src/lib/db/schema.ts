import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const patients = sqliteTable('patients', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  identificationNumber: text('identification_number').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  gender: text('gender'),
  bloodType: text('blood_type'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  emergencyContactName: text('emergency_contact_name'),
  emergencyContactPhone: text('emergency_contact_phone'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const medicalRecords = sqliteTable('medical_records', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  visitDate: text('visit_date').notNull().default(sql`(datetime('now'))`),
  reasonForVisit: text('reason_for_visit').notNull(),
  symptoms: text('symptoms'),
  physicalExamination: text('physical_examination'),
  diagnosis: text('diagnosis').notNull(),
  treatment: text('treatment'),
  prescriptions: text('prescriptions'),
  notes: text('notes'),
  doctorName: text('doctor_name'),
  createdByEmail: text('created_by_email'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  patientId: text('patient_id').notNull().references(() => patients.id, { onDelete: 'cascade' }),
  appointmentDate: text('appointment_date').notNull(),
  reason: text('reason'),
  status: text('status', { enum: ['scheduled', 'completed', 'cancelled'] }).notNull().default('scheduled'),
  notes: text('notes'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const recordImages = sqliteTable('record_images', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  recordId: text('record_id').notNull().references(() => medicalRecords.id, { onDelete: 'cascade' }),
  r2Key: text('r2_key').notNull(),
  fileName: text('file_name').notNull(),
  contentType: text('content_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})

// Inferred types for use across the app
export type Patient = typeof patients.$inferSelect
export type NewPatient = typeof patients.$inferInsert
export type MedicalRecord = typeof medicalRecords.$inferSelect
export type NewMedicalRecord = typeof medicalRecords.$inferInsert
export type Appointment = typeof appointments.$inferSelect
export type NewAppointment = typeof appointments.$inferInsert
export type RecordImage = typeof recordImages.$inferSelect
export type NewRecordImage = typeof recordImages.$inferInsert
