// src/utils.js
export function normalizeHeader(h) {
  return String(h ?? "")
    .trim()
    .replace(/\s+/g, "_");
}

export function parseMaybeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d) ? null : d;
}
