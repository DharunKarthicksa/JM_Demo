/**
 * utils/logger.ts
 * -----------------------------------------------------------------------------
 * Thin logging wrapper. In production this would forward to an observability
 * backend (Datadog, Splunk, etc.); for the demo it proxies to console with a
 * consistent prefix so request/response flow is easy to follow in devtools.
 */

const prefix = '[JM]';

export const logger = {
  debug: (...args: unknown[]) => console.debug(prefix, ...args),
  info: (...args: unknown[]) => console.info(prefix, ...args),
  warn: (...args: unknown[]) => console.warn(prefix, ...args),
  error: (...args: unknown[]) => console.error(prefix, ...args),
};

export default logger;
