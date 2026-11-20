-- Settings, post log, audit, legacy mapping + seed defaults

CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_by TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS post_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  set_id      TEXT NOT NULL,
  q_seq       INTEGER NOT NULL,
  asset_type  TEXT NOT NULL CHECK(asset_type IN ('teaser','reveal','combined')),
  platform    TEXT NOT NULL DEFAULT 'instagram',
  posted_at   TEXT NOT NULL,
  post_url    TEXT,
  posted_by   TEXT,
  FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_post_set ON post_log(set_id, q_seq, asset_type);

CREATE TABLE IF NOT EXISTS audit_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  actor       TEXT,
  action      TEXT NOT NULL,
  entity      TEXT,
  before_json TEXT,
  after_json  TEXT,
  ts          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity);
CREATE INDEX IF NOT EXISTS idx_audit_ts ON audit_log(ts);

CREATE TABLE IF NOT EXISTS legacy_map (
  old_id TEXT PRIMARY KEY,
  new_id TEXT NOT NULL
);

-- Seed defaults (idempotent)
INSERT OR IGNORE INTO settings(key, value, updated_at) VALUES
  ('brand', 'PREPAREKORA', datetime('now')),
  ('reveal_delay_hours', '6', datetime('now')),
  ('reveal_mode', 'auto', datetime('now')),
  ('reveal_show_options', 'false', datetime('now')),
  ('reveal_explanation_length', 'medium', datetime('now')),
  ('default_language', 'both', datetime('now')),
  ('duplicate_guard', 'true', datetime('now')),
  ('template_lock', 'true', datetime('now')),
  ('require_post_confirmation', 'true', datetime('now')),
  ('allow_repost', 'false', datetime('now')),
  ('teaser_cta_text', 'Comment your answer 👇', datetime('now')),
  ('watermark_text', 'PREPAREKORA', datetime('now')),
  ('exams', 'ADRE', datetime('now'));
