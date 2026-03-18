/**
 * Sanitized base URL — guards against malformed env vars (e.g. "$https://...\n")
 * Only uses NEXT_PUBLIC_BASE_URL if it looks like a valid http/https URL.
 */
const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim() ?? ""
export const BASE_URL = /^https?:\/\/.+/.test(raw)
  ? raw
  : "https://bodymetrics.xyz"
