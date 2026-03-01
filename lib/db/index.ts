import { drizzle, DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from './schema'

export type Database = DrizzleD1Database<typeof schema>

let _db: Database | null = null

export function getDb(d1: D1Database): Database {
  if (!_db) {
    _db = drizzle(d1, { schema })
  }
  return _db
}
