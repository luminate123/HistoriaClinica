'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import type { MedicalRecord, Patient } from '@/lib/db/schema'

type RecordWithPatient = MedicalRecord & { patient: Patient | null }

export function RecordsSearch({ records }: { records: RecordWithPatient[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRecords = records.filter((record) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      record.diagnosis.toLowerCase().includes(searchLower) ||
      record.reasonForVisit.toLowerCase().includes(searchLower) ||
      (record.patient &&
        `${record.patient.firstName} ${record.patient.lastName}`
          .toLowerCase()
          .includes(searchLower))
    )
  })

  return (
    <>
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por paciente, diagnóstico o motivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 px-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron historias' : 'No hay historias clínicas'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando la primera historia clínica'}
            </p>
            {!searchTerm && (
              <Link
                href="/records/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Historia
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <Link
                key={record.id}
                href={`/records/${record.id}`}
                className="block p-6 hover:bg-gray-50 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {record.reasonForVisit}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {format(new Date(record.visitDate), 'dd/MM/yyyy')}
                      </span>
                    </div>

                    {record.patient && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Paciente:</span>{' '}
                        {record.patient.firstName} {record.patient.lastName}
                      </p>
                    )}

                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">Diagnóstico:</span> {record.diagnosis}
                    </p>

                    {record.doctorName && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Doctor:</span> {record.doctorName}
                      </p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-gray-400 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
