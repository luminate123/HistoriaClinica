'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createRecord } from '@/lib/actions/records'

type PatientOption = { id: string; firstName: string; lastName: string; identificationNumber: string }

export function RecordForm({
  patients,
  defaultPatientId,
}: {
  patients: PatientOption[]
  defaultPatientId: string
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    patientId: defaultPatientId,
    visitDate: new Date().toISOString().slice(0, 16),
    reasonForVisit: '',
    symptoms: '',
    physicalExamination: '',
    diagnosis: '',
    treatment: '',
    prescriptions: '',
    notes: '',
    doctorName: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!formData.patientId) {
      setError('Debe seleccionar un paciente')
      setLoading(false)
      return
    }

    try {
      await createRecord(formData)
    } catch (err) {
      // redirect() throws NEXT_REDIRECT which we should let propagate
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
      const message = err instanceof Error ? err.message : 'Error al crear historia clínica'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/records" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Historia Clínica</h1>
          <p className="text-gray-600 mt-1">Registro de consulta médica</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Patient Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Paciente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                Paciente *
              </label>
              <select
                id="patientId"
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar paciente...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} - {p.identificationNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="visitDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora de Consulta *
              </label>
              <input
                type="datetime-local"
                id="visitDate"
                name="visitDate"
                required
                value={formData.visitDate}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-2">
                Médico Tratante
              </label>
              <input
                type="text"
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dr. Juan Pérez"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Clínica</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="reasonForVisit" className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de Consulta *
              </label>
              <input
                type="text"
                id="reasonForVisit"
                name="reasonForVisit"
                required
                value={formData.reasonForVisit}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Dolor de cabeza persistente"
              />
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
                Síntomas
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                rows={3}
                value={formData.symptoms}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describa los síntomas presentados..."
              />
            </div>

            <div>
              <label htmlFor="physicalExamination" className="block text-sm font-medium text-gray-700 mb-2">
                Examen Físico
              </label>
              <textarea
                id="physicalExamination"
                name="physicalExamination"
                rows={3}
                value={formData.physicalExamination}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Resultado del examen físico..."
              />
            </div>

            <div>
              <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-2">
                Diagnóstico *
              </label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                rows={3}
                required
                value={formData.diagnosis}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Diagnóstico médico..."
              />
            </div>

            <div>
              <label htmlFor="treatment" className="block text-sm font-medium text-gray-700 mb-2">
                Tratamiento
              </label>
              <textarea
                id="treatment"
                name="treatment"
                rows={3}
                value={formData.treatment}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Plan de tratamiento..."
              />
            </div>

            <div>
              <label htmlFor="prescriptions" className="block text-sm font-medium text-gray-700 mb-2">
                Prescripciones
              </label>
              <textarea
                id="prescriptions"
                name="prescriptions"
                rows={3}
                value={formData.prescriptions}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Medicamentos recetados, dosis y frecuencia..."
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Observaciones adicionales..."
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            href="/records"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Guardar Historia Clínica'}
          </button>
        </div>
      </form>
    </div>
  )
}
