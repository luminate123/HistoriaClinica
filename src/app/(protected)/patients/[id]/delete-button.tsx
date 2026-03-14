'use client'

import { deletePatient } from '@/lib/actions/patients'

export function DeletePatientButton({ patientId }: { patientId: string }) {
  const handleDelete = async () => {
    if (!confirm('¿Está seguro de eliminar este paciente? Esta acción no se puede deshacer.')) {
      return
    }
    try {
      await deletePatient(patientId)
    } catch {
      alert('Error al eliminar paciente')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}
