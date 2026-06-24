/**
 * utils/retry.ts
 * -----------------------------------------------------------------------------
 * Generic exponential-backoff retry helper used by the API service for
 * idempotent requests. Kept framework-agnostic so it can be unit tested in
 * isolation and reused by any service.
 */

export interface RetryOptions {
  retries: number;
  /** Base delay in ms; doubles each attempt. */
  baseDelayMs?: number;
  /** Predicate deciding whether a given error is retryable. */
  shouldRetry?: (error: unknown) => boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Run an async operation, retrying on failure with exponential backoff.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const { retries, baseDelayMs = 300, shouldRetry = () => true } = options;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === retries;
      if (isLastAttempt || !shouldRetry(error)) {
        break;
      }
      const delay = baseDelayMs * 2 ** attempt;
      // eslint-disable-next-line no-console
      console.warn(`[retry] attempt ${attempt + 1} failed, retrying in ${delay}ms`);
      await sleep(delay);
    }
  }
  throw lastError;
}
