'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Appointment, Patient } from '@/lib/db/schema'

type AppointmentWithPatient = Appointment & { patient: Patient | null }

function getStatusColor(status: string) {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'scheduled':
      return 'Programada'
    case 'completed':
      return 'Completada'
    case 'cancelled':
      return 'Cancelada'
    default:
      return status
  }
}

export function AppointmentsList({ appointments }: { appointments: AppointmentWithPatient[] }) {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all')

  const filtered = appointments.filter(
    (apt) => filter === 'all' || apt.status === filter,
  )

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex gap-2">
          {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Todas' : getStatusText(f) + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay citas {filter !== 'all' ? getStatusText(filter).toLowerCase() + 's' : ''}
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'No hay citas programadas en el sistema'
                : `No hay citas con estado: ${getStatusText(filter).toLowerCase()}`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filtered.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {format(
                          new Date(appointment.appointmentDate),
                          "dd/MM/yyyy 'a las' HH:mm",
                        )}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(appointment.status)}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>

                    {appointment.patient && (
                      <Link
                        href={`/patients/${appointment.patient.id}`}
                        className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
                      >
                        <span className="font-medium">Paciente:</span>{' '}
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </Link>
                    )}

                    {appointment.reason && (
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Motivo:</span> {appointment.reason}
                      </p>
                    )}

                    {appointment.notes && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notas:</span> {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
