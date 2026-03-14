import { getAppointments } from '@/lib/actions/appointments'
import { AppointmentsList } from './appointments-list'

export default async function AppointmentsPage() {
  const rows = await getAppointments()

  const items = rows.map((row) => ({
    ...row.appointments,
    patient: row.patients,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Citas Médicas</h1>
        <p className="text-gray-600 mt-1">Gestión de citas programadas</p>
      </div>

      <AppointmentsList appointments={items} />
    </div>
  )
}

