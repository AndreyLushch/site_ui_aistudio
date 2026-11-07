/**
 * Activation code formatting, normalization and generation.
 * Specification: Format XXXX-XXXX-XXXX-XXXX without ambiguous characters (0/O, 1/I).
 */

export const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

/**
 * Normalizes user input: strips spaces, dashes, and forces uppercase.
 */
export function normalizeCode(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();
}

/**
 * Formats a clean 16-character string into XXXX-XXXX-XXXX-XXXX.
 */
export function formatCode(normalized: string): string {
  const clean = normalizeCode(normalized);
  const parts: string[] = [];
  for (let i = 0; i < clean.length && i < 16; i += 4) {
    parts.push(clean.slice(i, i + 4));
  }
  return parts.join('-');
}

/**
 * Validates if the normalized code has exactly 16 characters from the allowed alphabet.
 */
export function isValidCodeFormat(input: string): boolean {
  const clean = normalizeCode(input);
  if (clean.length !== 16) return false;
  for (const char of clean) {
    if (!CODE_ALPHABET.includes(char)) return false;
  }
  return true;
}

/**
 * Generates a compliant random 16-character activation code.
 */
export function generateActivationCode(): string {
  let result = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * CODE_ALPHABET.length);
    result += CODE_ALPHABET[randomIndex];
  }
  return formatCode(result);
}

/**
 * Masks email for privacy, e.g. andrey@mail.ru -> a***@mail.ru
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const [local, domain] = email.split('@');
  if (local.length <= 1) {
    return `${local}***@${domain}`;
  }
  const first = local[0];
  return `${first}***@${domain}`;
}
