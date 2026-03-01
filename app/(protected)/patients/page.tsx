import Link from 'next/link'
import { getPatients } from '@/lib/actions/patients'
import { PatientsSearch } from './patients-search'

export default async function PatientsPage() {
  const patients = await getPatients()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-1">Gestión de pacientes registrados</p>
        </div>
        <Link
          href="/patients/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Paciente
        </Link>
      </div>

      <PatientsSearch patients={patients} />
    </div>
  )
}
