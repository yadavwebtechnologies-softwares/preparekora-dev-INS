// Global constants — enums, defaults, error codes. No secrets here.

export const BRAND = 'PREPAREKORA';
export const SEQ_START = 5;
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // UTC+5:30

export const SUBJECTS = {
  GK:   'General Knowledge',
  SS:   'Social Studies',
  ENG:  'General English',
  MATH: 'Mathematics',
  LR:   'Logical Reasoning',
  CK:   'Computer Knowledge',
};

export const EXAMS_DEFAULT = {
  ADRE: 'Assam Direct Recruitment Exam',
};

export const RATIOS = ['1x1', '4x5', '9x16'];

export const ASSET_TYPES = ['teaser', 'reveal', 'combined'];

export const SET_STAGES = ['draft', 'teaser_published', 'answer_published', 'archived'];

export const ASSET_STATUS = ['staged', 'published', 'archived'];

export const ERR = {
  INVALID_EXAM:             'INVALID_EXAM',
  INVALID_SUBJECT:          'INVALID_SUBJECT',
  INVALID_RATIO:            'INVALID_RATIO',
  INVALID_ANSWER_KEY:       'INVALID_ANSWER_KEY',
  MANUAL_ID_FORBIDDEN:      'MANUAL_ID_FORBIDDEN',
  DUPLICATE_QUESTION:       'DUPLICATE_QUESTION',
  STALE_PERIOD:             'STALE_PERIOD',
  MISSING_IDEMPOTENCY_KEY:  'MISSING_IDEMPOTENCY_KEY',
  BRAND_MISMATCH:           'BRAND_MISMATCH',
  TEMPLATE_MISMATCH:        'TEMPLATE_MISMATCH',
  TEASER_NOT_POSTED:        'TEASER_NOT_POSTED',
  NOT_FOUND:                'NOT_FOUND',
  UNAUTHORIZED:             'UNAUTHORIZED',
  FORBIDDEN:                'FORBIDDEN',
  VALIDATION_ERROR:         'VALIDATION_ERROR',
  INTERNAL_ERROR:           'INTERNAL_ERROR',
};

export const SETTING_DEFAULTS = {
  reveal_delay_hours:         6,
  reveal_mode:                'auto',
  reveal_show_options:        false,
  reveal_explanation_length:  'medium',
  default_language:           'both',
  duplicate_guard:            true,
  template_lock:              true,
  require_post_confirmation:  true,
  allow_repost:               false,
  teaser_cta_text:            'Comment your answer 👇',
  watermark_text:             'PREPAREKORA',
};
