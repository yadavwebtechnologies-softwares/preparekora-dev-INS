-- Core tables for Preparekora MCQ system
-- PKs + UNIQUE constraints enforce anti-duplication at DB level

CREATE TABLE IF NOT EXISTS id_counters (
  brand    TEXT NOT NULL,
  exam     TEXT NOT NULL,
  subject  TEXT NOT NULL,
  ym       TEXT NOT NULL,
  next_seq INTEGER NOT NULL DEFAULT 5,
  PRIMARY KEY (brand, exam, subject, ym)
);

CREATE TABLE IF NOT EXISTS sets (
  id              TEXT PRIMARY KEY,
  brand           TEXT NOT NULL,
  exam            TEXT NOT NULL,
  subject         TEXT NOT NULL,
  ym              TEXT NOT NULL,
  seq             INTEGER NOT NULL,
  stage           TEXT NOT NULL DEFAULT 'draft',
  language_mode   TEXT NOT NULL DEFAULT 'both',
  idempotency_key TEXT NOT NULL UNIQUE,
  version         INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sets_exam_subject ON sets(exam, subject, ym);
CREATE INDEX IF NOT EXISTS idx_sets_stage ON sets(stage);

CREATE TABLE IF NOT EXISTS questions (
  id           TEXT PRIMARY KEY,
  set_id       TEXT NOT NULL,
  seq          INTEGER NOT NULL,
  q_en         TEXT NOT NULL,
  q_as         TEXT NOT NULL,
  a_en         TEXT NOT NULL, a_as TEXT NOT NULL,
  b_en         TEXT NOT NULL, b_as TEXT NOT NULL,
  c_en         TEXT NOT NULL, c_as TEXT NOT NULL,
  d_en         TEXT NOT NULL, d_as TEXT NOT NULL,
  answer_key   TEXT NOT NULL CHECK(answer_key IN ('A','B','C','D')),
  expl_en      TEXT NOT NULL,
  expl_as      TEXT NOT NULL,
  topic        TEXT,
  content_hash TEXT NOT NULL UNIQUE,
  created_at   TEXT NOT NULL,
  FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
  UNIQUE(set_id, seq)
);
CREATE INDEX IF NOT EXISTS idx_questions_set ON questions(set_id);
CREATE INDEX IF NOT EXISTS idx_questions_hash ON questions(content_hash);

CREATE TABLE IF NOT EXISTS assets (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  set_id       TEXT NOT NULL,
  q_seq        INTEGER NOT NULL,
  type         TEXT NOT NULL CHECK(type IN ('teaser','reveal','combined')),
  ratio        TEXT NOT NULL CHECK(ratio IN ('1x1','4x5','9x16')),
  lang         TEXT NOT NULL CHECK(lang IN ('en','as','both')),
  version      INTEGER NOT NULL DEFAULT 1,
  r2_key       TEXT NOT NULL,
  checksum     TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'staged' CHECK(status IN ('staged','published','archived')),
  generated_at TEXT NOT NULL,
  published_at TEXT,
  FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE,
  UNIQUE(set_id, q_seq, type, ratio, lang, version),
  UNIQUE(checksum)
);
CREATE INDEX IF NOT EXISTS idx_assets_set ON assets(set_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type, status);
