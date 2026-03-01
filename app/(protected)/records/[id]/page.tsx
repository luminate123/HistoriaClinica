import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getRecordById } from '@/lib/actions/records'
import { getPatientById } from '@/lib/actions/patients'
import { getImagesByRecordId } from '@/lib/actions/images'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { RecordActions } from './record-actions'
import { ImageGallery } from './image-gallery'

export default async function RecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await getRecordById(id)
  if (!record) notFound()

  const [patient, images] = await Promise.all([
    getPatientById(record.patientId),
    getImagesByRecordId(id),
  ])

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/records" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historia Clínica</h1>
            <p className="text-gray-600 mt-1">
              {format(new Date(record.visitDate), "dd 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>
        <RecordActions recordId={record.id} />
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-center mb-4">Historia Clínica</h1>
        <p className="text-center text-gray-600">
          {format(new Date(record.visitDate), "dd 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
        </p>
      </div>

      {/* Patient Information Card */}
      {patient && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Información del Paciente</h2>
            <Link
              href={`/patients/${patient.id}`}
              className="text-sm text-blue-600 hover:text-blue-700 print:hidden"
            >
              Ver perfil completo →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="text-base font-medium text-gray-900">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Identificación</p>
              <p className="text-base font-medium text-gray-900">{patient.identificationNumber}</p>
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
          </div>
        </div>
      )}

      {/* Medical Record Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Consulta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Fecha de Consulta</p>
              <p className="text-base font-medium text-gray-900">
                {format(new Date(record.visitDate), "dd/MM/yyyy 'a las' HH:mm")}
              </p>
            </div>
            {record.doctorName && (
              <div>
                <p className="text-sm text-gray-600">Médico Tratante</p>
                <p className="text-base font-medium text-gray-900">{record.doctorName}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Motivo de Consulta</h3>
              <p className="text-gray-700">{record.reasonForVisit}</p>
            </div>

            {record.symptoms && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Síntomas</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{record.symptoms}</p>
              </div>
            )}

            {record.physicalExamination && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Examen Físico</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{record.physicalExamination}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Diagnóstico</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{record.diagnosis}</p>
            </div>

            {record.treatment && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Tratamiento</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{record.treatment}</p>
              </div>
            )}

            {record.prescriptions && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Prescripciones</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{record.prescriptions}</p>
              </div>
            )}

            {record.notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Notas Adicionales</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{record.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            Registro creado el {format(new Date(record.createdAt), "dd/MM/yyyy 'a las' HH:mm")}
          </p>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ImageGallery recordId={record.id} initialImages={images} />
      </div>
    </div>
  )
}
