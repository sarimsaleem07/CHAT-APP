import * as Yup from 'yup'

export const LIMITS = {
  nameMin: 2,
  nameMax: 50,
  emailMax: 254,
  emailLocalMax: 64,
  passwordMin: 8,
  passwordMax: 64,
  messageMax: 2000,
  groupNameMin: 2,
  groupNameMax: 50,
  groupMembersMin: 2,
  groupMembersMax: 50,
  aboutMax: 140,
  searchMax: 50,
  imageMaxMB: 2,
  attachmentMaxMB: 25,
  fileNameMax: 255,
}

const EMAIL_REGEX =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/

// letters of any language (English, Urdu...), single spaces, ' . -
const NAME_REGEX = /^[\p{L}][\p{L}\p{M}' .-]*$/u

const COMMON_PASSWORDS = [
  'password',
  'password1',
  'password123',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty123',
  'qwertyuiop',
  'iloveyou',
  'admin123',
  'welcome1',
  'abc12345',
  'letmein1',
  'pakistan',
  'pakistan123',
  'football',
  'baseball',
]

// Used by Yup AND by the live checklist (PasswordHints) so both always match.
export const PASSWORD_RULES = [
  {
    id: 'length',
    label: `${LIMITS.passwordMin}–${LIMITS.passwordMax} characters`,
    message: `Password must be ${LIMITS.passwordMin}–${LIMITS.passwordMax} characters`,
    test: (v) => v.length >= LIMITS.passwordMin && v.length <= LIMITS.passwordMax,
  },
  {
    id: 'upper',
    label: 'One uppercase letter (A–Z)',
    message: 'Add at least one uppercase letter (A–Z)',
    test: (v) => /[A-Z]/.test(v),
  },
  {
    id: 'lower',
    label: 'One lowercase letter (a–z)',
    message: 'Add at least one lowercase letter (a–z)',
    test: (v) => /[a-z]/.test(v),
  },
  { id: 'number', label: 'One number (0–9)', message: 'Add at least one number (0–9)', test: (v) => /\d/.test(v) },
  {
    id: 'special',
    label: 'One special character (!@#$...)',
    message: 'Add at least one special character (!@#$...)',
    test: (v) => /[^A-Za-z0-9\s]/.test(v),
  },
  {
    id: 'spaces',
    label: 'No spaces',
    message: 'Password can’t contain spaces',
    test: (v) => v.length > 0 && !/\s/.test(v),
  },
]

export const nameRule = Yup.string()
  .transform((v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : v))
  .required('Enter your name')
  .min(LIMITS.nameMin, `Name must be at least ${LIMITS.nameMin} characters`)
  .max(LIMITS.nameMax, `Name can’t be longer than ${LIMITS.nameMax} characters`)
  .test('no-digits', 'Name can’t contain numbers', (v) => !v || !/\d/.test(v))
  .matches(NAME_REGEX, "Name can only contain letters, spaces, apostrophes ( ' ), dots and hyphens")
  .test('no-repeat-symbols', 'Name can’t have symbols next to each other', (v) => !v || !/['.-]{2,}/.test(v))
  .test('ends-with-letter', 'Name must end with a letter', (v) => !v || /[\p{L}.]$/u.test(v))
  .test('min-letters', 'Name must have at least 2 letters', (v) => !v || (v.match(/\p{L}/gu) || []).length >= 2)

export const emailRule = Yup.string()
  .transform((v) => (typeof v === 'string' ? v.trim().toLowerCase() : v))
  .required('Enter your email')
  .max(LIMITS.emailMax, 'Email is too long')
  .test('no-spaces', 'Email can’t contain spaces', (v) => !v || !/\s/.test(v))
  .test('has-at', 'Email must contain one @', (v) => !v || (v.match(/@/g) || []).length === 1)
  .test('local-length', 'The part before @ is too long', (v) => !v || v.split('@')[0].length <= LIMITS.emailLocalMax)
  .test('no-double-dots', 'Email can’t have two dots in a row', (v) => !v || !v.includes('..'))
  .matches(EMAIL_REGEX, 'Enter a valid email, e.g. name@example.com')

// Login: only check it's filled — strength rules apply when creating a password, not when entering an old one.
export const loginPasswordRule = Yup.string()
  .required('Enter your password')
  .max(LIMITS.passwordMax, `Password can’t be longer than ${LIMITS.passwordMax} characters`)

export const newPasswordRule = PASSWORD_RULES.reduce(
  (schema, rule) => schema.test(rule.id, rule.message, (v) => !v || rule.test(v)),
  Yup.string().required('Create a password'),
)
  .test(
    'not-common',
    'This password is too common, choose another',
    (v) => !v || !COMMON_PASSWORDS.includes(v.toLowerCase()),
  )
  .test('no-email', 'Password can’t contain your email name', function (v) {
    const local = (this.parent.email || '').split('@')[0].trim().toLowerCase()
    return !v || local.length < 3 || !v.toLowerCase().includes(local)
  })
  .test('no-name', 'Password can’t contain your name', function (v) {
    const parts = (this.parent.name || '')
      .toLowerCase()
      .split(/\s+/)
      .filter((p) => p.length >= 3)
    return !v || !parts.some((p) => v.toLowerCase().includes(p))
  })

export const confirmPasswordRule = (field = 'password') =>
  Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref(field)], 'Passwords don’t match')

export const messageRule = Yup.string()
  .test('not-blank', 'Message can’t be empty', (v) => !!v && v.trim().length > 0)
  .max(LIMITS.messageMax, `Message can’t be longer than ${LIMITS.messageMax} characters`)

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// optional profile/group photo (File object)
export const imageFileRule = Yup.mixed()
  .nullable()
  .test(
    'type',
    'Photo must be a JPG, PNG or WEBP image',
    (f) => !f || !(f instanceof File) || IMAGE_TYPES.includes(f.type),
  )
  .test(
    'size',
    `Photo must be smaller than ${LIMITS.imageMaxMB} MB`,
    (f) => !f || !(f instanceof File) || f.size <= LIMITS.imageMaxMB * 1024 * 1024,
  )
  .test('not-empty', 'This file is empty', (f) => !f || !(f instanceof File) || f.size > 0)

export const groupNameRule = Yup.string()
  .transform((v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : v))
  .required('Enter a group name')
  .min(LIMITS.groupNameMin, `Group name must be at least ${LIMITS.groupNameMin} characters`)
  .max(LIMITS.groupNameMax, `Group name can’t be longer than ${LIMITS.groupNameMax} characters`)
  .test('has-letter', 'Group name must contain a letter or number', (v) => !v || /[\p{L}\p{N}]/u.test(v))
  .matches(
    /^(?:[\p{L}\p{N}\p{M}\p{Extended_Pictographic} '&().,!?#@_-]|\u200d|\ufe0f)+$/u,
    'Group name can only contain letters, numbers, emojis and & ( ) . , ! ? # @ _ -',
  )
  .test(
    'no-repeat-symbols',
    'Group name can’t have 3 or more symbols in a row',
    (v) => !v || !/(?:(?![\p{L}\p{N}\p{M}\p{Extended_Pictographic}\s]|\u200d|\ufe0f).){3,}/u.test(v),
  )

export const groupMembersRule = Yup.array()
  .of(Yup.string())
  .min(LIMITS.groupMembersMin, `Select at least ${LIMITS.groupMembersMin} members`)
  .max(LIMITS.groupMembersMax, `A group can have up to ${LIMITS.groupMembersMax} members`)
  .test('unique', 'A member was added twice', (arr) => !arr || new Set(arr).size === arr.length)

export const aboutRule = Yup.string()
  .transform((v) => (typeof v === 'string' ? v.trim() : v))
  .max(LIMITS.aboutMax, `About can’t be longer than ${LIMITS.aboutMax} characters`)
  .test('no-links', 'About can’t contain links', (v) => !v || !/(https?:\/\/|www\.)/i.test(v))

export const ATTACHMENT_TYPES = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
  'image/gif': 'GIF',
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'text/plain': 'TXT',
  'text/csv': 'CSV',
  'application/zip': 'ZIP',
  'application/x-zip-compressed': 'ZIP',
}

const BLOCKED_EXTENSIONS = ['exe', 'bat', 'cmd', 'com', 'msi', 'scr', 'sh', 'ps1', 'vbs', 'js', 'jar', 'apk', 'dll']

const extensionOf = (name = '') => (name.includes('.') ? name.split('.').pop().toLowerCase() : '')

export const attachmentRule = Yup.mixed()
  .nullable()
  .test(
    'blocked',
    'This file type isn’t allowed for security reasons',
    (f) => !f || !BLOCKED_EXTENSIONS.includes(extensionOf(f.name)),
  )
  .test(
    'type',
    'Only images, PDF, Word, Excel, PowerPoint, TXT, CSV and ZIP files are allowed',
    (f) => !f || !!ATTACHMENT_TYPES[f.type],
  )
  .test('empty', 'This file is empty', (f) => !f || f.size > 0)
  .test(
    'size',
    `File must be smaller than ${LIMITS.attachmentMaxMB} MB`,
    (f) => !f || f.size <= LIMITS.attachmentMaxMB * 1024 * 1024,
  )
  .test('name', 'File name is too long', (f) => !f || f.name.length <= LIMITS.fileNameMax)

// text is required only when there is no attachment (then it's an optional caption)
export const composerTextRule = Yup.string()
  .max(LIMITS.messageMax, `Message can’t be longer than ${LIMITS.messageMax} characters`)
  .when('attachment', {
    is: (a) => !a,
    then: (schema) => schema.test('not-blank', 'Message can’t be empty', (v) => !!v && v.trim().length > 0),
  })
