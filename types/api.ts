/**
 * Response base para todas las respuestas de API
 */
export type ApiResponse<T = unknown> = {
  data: T | null
  error: string | null
  status: number
  errors?: Record<string, string[]>
}

/**
 * Tipos de errores de API
 */
export interface ApiError {
  code: string
  message: string
  statusCode: number
}

/**
 * Configuración de peticiones
 */
export interface RequestConfig {
  timeout?: number
  retries?: number
  headers?: Record<string, string>
}
