-- Migration: Add record_images table for storing medical images in R2
-- Target: Cloudflare D1 (SQLite)

CREATE TABLE IF NOT EXISTS record_images (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  r2_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_record_images_record_id ON record_images(record_id);
