/**
 * Generate a unique ID using timestamp + random suffix.
 * Provides sufficient uniqueness for client-side entity identification.
 */
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
