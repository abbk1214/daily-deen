/* ──────────────────────────────────────────────
   Global error handling utilities
   ────────────────────────────────────────────── */

export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: number
  recoverable: boolean
}

/* ──────────────────────────────────────────────
   Error categories
   ────────────────────────────────────────────── */

export function createAppError(
  code: string,
  message: string,
  details?: unknown,
  recoverable = true,
): AppError {
  return {
    code,
    message,
    details,
    timestamp: Date.now(),
    recoverable,
  }
}

export const ErrorCodes = {
  DB_CORRUPTED: "DB_CORRUPTED",
  DB_QUOTA_EXCEEDED: "DB_QUOTA_EXCEEDED",
  NETWORK_ERROR: "NETWORK_ERROR",
  API_ERROR: "API_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  PARSE_ERROR: "PARSE_ERROR",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  UNKNOWN: "UNKNOWN",
} as const

/* ──────────────────────────────────────────────
   Retry utility with exponential backoff
   ────────────────────────────────────────────── */

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  onRetry?: (attempt: number, error: Error) => void
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000, onRetry } = options

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxRetries) throw err

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
      onRetry?.(attempt + 1, err as Error)

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error("Retry: unreachable")
}

/* ──────────────────────────────────────────────
   Database corruption recovery
   ────────────────────────────────────────────── */

export async function recoverFromDbError(): Promise<boolean> {
  try {
    // Try to open and close the database to reset state
    const { getDb } = await import("./db/schema")
    const db = getDb()
    await db.open()
    return true
  } catch {
    return false
  }
}

/* ──────────────────────────────────────────────
   Error logging (development only)
   ────────────────────────────────────────────── */

export function logError(error: AppError | Error, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.error(`[DailyDeen Error${context ? `: ${context}` : ""}]:`, error)
  }
}

/* ──────────────────────────────────────────────
   Safe async wrapper
   ────────────────────────────────────────────── */

export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    logError(err as Error, "safeAsync")
    return fallback
  }
}
