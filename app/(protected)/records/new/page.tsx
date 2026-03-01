import { getPatientsForSelect } from '@/lib/actions/patients'
import { RecordForm } from './record-form'

export default async function NewRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ patient_id?: string }>
}) {
  const [patients, sp] = await Promise.all([getPatientsForSelect(), searchParams])

  return <RecordForm patients={patients} defaultPatientId={sp.patient_id ?? ''} />
}
