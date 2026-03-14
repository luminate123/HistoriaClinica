import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPatientById } from '@/lib/actions/patients'
import { getRecordsByPatientId } from '@/lib/actions/records'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DeletePatientButton } from './delete-button'

function calculateAge(dateOfBirth: string) {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [patient, records] = await Promise.all([
    getPatientById(id),
    getRecordsByPatientId(id),
  ])

  if (!patient) notFound()

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/patients"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600 mt-1">ID: {patient.identificationNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/records/new?patient_id=${patient.id}`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Consulta
          </Link>
          <DeletePatientButton patientId={patient.id} />
        </div>
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Edad</p>
              <p className="text-base font-medium text-gray-900">{calculateAge(patient.dateOfBirth)} años</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Nacimiento</p>
              <p className="text-base font-medium text-gray-900">
                {format(new Date(patient.dateOfBirth), 'dd/MM/yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Género</p>
              <p className="text-base font-medium text-gray-900">{patient.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo de Sangre</p>
              {patient.bloodType ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {patient.bloodType}
                </span>
              ) : (
                <p className="text-base font-medium text-gray-900">N/A</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="text-base font-medium text-gray-900">{patient.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Correo</p>
              <p className="text-base font-medium text-gray-900">{patient.email || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Dirección</p>
              <p className="text-base font-medium text-gray-900">{patient.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contacto de Emergencia</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="text-base font-medium text-gray-900">
                {patient.emergencyContactName || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Teléfono</p>
              <p className="text-base font-medium text-gray-900">
                {patient.emergencyContactPhone || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Records */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Historias Clínicas</h2>
          <span className="text-sm text-gray-600">{records.length} registro(s)</span>
        </div>
        <div className="p-6">
          {records.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 mb-4">No hay historias clínicas registradas</p>
              <Link
                href={`/records/new?patient_id=${patient.id}`}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Primera Consulta
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <Link
                  key={record.id}
                  href={`/records/${record.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{record.reasonForVisit}</h3>
                        <span className="text-sm text-gray-500">
                          {format(new Date(record.visitDate), "dd 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Diagnóstico:</span> {record.diagnosis}
                      </p>
                      {record.doctorName && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Doctor:</span> {record.doctorName}
                        </p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
