import { Response } from 'express';
import type { ZodSafeParseResult } from 'zod';
import { sendError } from './response.js';

/**
 * Validates Zod schema and sends error response if validation fails.
 * Returns parsed data on success, or throws if validation fails (caller should not handle error case).
 */
export const validateOrError = <T>(res: Response, parsed: ZodSafeParseResult<T>): T => {
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i: { message: string }) => i.message).join(', ');
    sendError(res, messages, 'INVALID_INPUT');
    // The response has been sent, so the next handler should return
    // We can signal this by throwing an error, but to keep the handler simpler,
    // we return undefined and let the caller handle the early return
    throw new Error('Validation failed - response already sent');
  }
  return parsed.data;
};
