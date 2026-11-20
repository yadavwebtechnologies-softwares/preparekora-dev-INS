// Global duplicate guard: SHA-256 of normalized question + options
// - Hash computed server-side (client cannot fake)
// - Scope: across ALL exams, ALL subjects, ALL time
// - Normalization: trim + lowercase + collapse whitespace

import { ERR } from '../constants.js';

export function normalize(s) {
  return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function normalizeQuestion(q) {
  // Stable order matters — never reorder these fields
  const fields = [
    q.q_en, q.q_as,
    q.a_en, q.a_as,
    q.b_en, q.b_as,
    q.c_en, q.c_as,
    q.d_en, q.d_as,
  ].map(normalize);

  // Reject empty required fields early
  if (fields.some(f => f.length === 0)) {
    const err = new Error(ERR.VALIDATION_ERROR);
    err.details = { reason: 'empty_question_or_option_field' };
    throw err;
  }

  return fields.join('|');
}

export async function computeHash(q) {
  const payload = normalizeQuestion(q);
  const buf = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function findDuplicate(env, hash) {
  return env.DB.prepare(
    `SELECT id, set_id FROM questions WHERE content_hash = ? LIMIT 1`
  ).bind(hash).first();
}

export async function assertNotDuplicate(env, hash) {
  const dup = await findDuplicate(env, hash);
  if (dup) {
    const err = new Error(ERR.DUPLICATE_QUESTION);
    err.details = {
      existing_question_id: dup.id,
      existing_set_id:      dup.set_id,
    };
    throw err;
  }
}

// Convenience: compute + check in one call
export async function hashAndCheck(env, q) {
  const hash = await computeHash(q);
  await assertNotDuplicate(env, hash);
  return hash;
}
