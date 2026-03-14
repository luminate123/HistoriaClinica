import Link from 'next/link'
import { getRecords } from '@/lib/actions/records'
import { RecordsSearch } from './records-search'

export default async function RecordsPage() {
  const rows = await getRecords()

  // Flatten the leftJoin result into a single object per row
  const records = rows.map((row) => ({
    ...row.medical_records,
    patient: row.patients,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historias Clínicas</h1>
          <p className="text-gray-600 mt-1">Registro de consultas médicas</p>
        </div>
        <Link
          href="/records/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Historia
        </Link>
      </div>

      <RecordsSearch records={records} />
    </div>
  )
}

