/**
 * Lightweight logger that only outputs in development mode.
 * Use instead of console.log/warn/error in production code.
 */

const isDev = import.meta.env?.DEV ?? false;

export const logger = {
  debug(...args: unknown[]): void {
    if (isDev) console.log(...args);
  },
  info(...args: unknown[]): void {
    if (isDev) console.info(...args);
  },
  warn(...args: unknown[]): void {
    if (isDev) console.warn(...args);
  },
  error(...args: unknown[]): void {
    // Errors always log (needed for production debugging)
    console.error(...args);
  },
};
