// Atomic ID allocation: PREPAREKORA/<EXAM>/<SUBJ>/<MM>/<YY>/<NNNN>
// - Sequence scoped per (brand, exam, subject, ym)
// - Starts at 5, resets monthly
// - Client cannot supply any segment

import { BRAND, SEQ_START, IST_OFFSET_MS, SUBJECTS, ERR } from '../constants.js';

function istParts() {
  const ist = new Date(Date.now() + IST_OFFSET_MS);
  const yy  = String(ist.getUTCFullYear()).slice(-2);
  const mm  = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const ym  = `${ist.getUTCFullYear()}-${mm}`;
  return { yy, mm, ym };
}

export async function allocateId(env, exam, subject) {
  if (!exam || typeof exam !== 'string') throw new Error(ERR.INVALID_EXAM);
  if (!subject || !(subject in SUBJECTS)) throw new Error(ERR.INVALID_SUBJECT);

  const { yy, mm, ym } = istParts();

  // Atomic in D1: insert-if-new, bump, read-back
  const stmts = [
    env.DB.prepare(
      `INSERT OR IGNORE INTO id_counters (brand, exam, subject, ym, next_seq)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(BRAND, exam, subject, ym, SEQ_START),
    env.DB.prepare(
      `UPDATE id_counters SET next_seq = next_seq + 1
       WHERE brand=? AND exam=? AND subject=? AND ym=?`
    ).bind(BRAND, exam, subject, ym),
    env.DB.prepare(
      `SELECT next_seq - 1 AS seq FROM id_counters
       WHERE brand=? AND exam=? AND subject=? AND ym=?`
    ).bind(BRAND, exam, subject, ym),
  ];

  const results = await env.DB.batch(stmts);
  const row = results[2]?.results?.[0];
  if (!row) throw new Error(ERR.INTERNAL_ERROR);

  const seqNum = row.seq;                            // 5, 6, 7, ...
  const seqStr = String(seqNum).padStart(4, '0');    // '0005'

  return {
    id:      `${BRAND}/${exam}/${subject}/${mm}/${yy}/${seqStr}`,
    brand:   BRAND,
    exam,
    subject,
    ym,
    yy,
    mm,
    seq:     seqNum,
    created_at: new Date().toISOString(),
  };
}

// Preview next ID without consuming it (for admin UI)
export async function peekNextId(env, exam, subject) {
  if (!exam || typeof exam !== 'string') throw new Error(ERR.INVALID_EXAM);
  if (!subject || !(subject in SUBJECTS)) throw new Error(ERR.INVALID_SUBJECT);

  const { yy, mm, ym } = istParts();

  const row = await env.DB.prepare(
    `SELECT next_seq FROM id_counters
     WHERE brand=? AND exam=? AND subject=? AND ym=?`
  ).bind(BRAND, exam, subject, ym).first();

  const seqNum = row ? row.next_seq : SEQ_START;
  const seqStr = String(seqNum).padStart(4, '0');

  return {
    preview: `${BRAND}/${exam}/${subject}/${mm}/${yy}/${seqStr}`,
    seq:     seqNum,
    ym,
  };
}
