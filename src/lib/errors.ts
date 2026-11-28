import axios from 'axios'

// بيقرا أول رسالة خطأ من رد لارافيل (errors أو message) من غير any
export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: unknown; errors?: Record<string, unknown> }
      | undefined
    const firstField = data?.errors ? Object.values(data.errors)[0] : undefined
    if (Array.isArray(firstField) && firstField[0]) return String(firstField[0])
    if (typeof data?.message === 'string' && data.message) return data.message
    return fallback
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}

export function getErrorStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined
}