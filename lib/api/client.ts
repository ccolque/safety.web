/**
 * Cliente API base para todas las peticiones HTTP usando Axios
 * Proporciona manejo centralizado de errores y logging
 */

import axios, { AxiosInstance, AxiosError } from 'axios'
import https from 'https'
import { ApiResponse, ApiError, RequestConfig } from '@/types/api'

const isDevelopment = process.env.NODE_ENV === 'development'

// Configure HTTPS Agent para certificados autofirmados (solo servidor)
let httpsAgent: https.Agent | undefined = undefined
if (typeof window === 'undefined') {
  httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
  })
}

class ApiClient {
  private axiosInstance: AxiosInstance
  private baseURL: string
  private timeout: number = 30000

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL  || 'http://localhost:8000') {
    this.baseURL = baseURL

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json-patch+json',
        'Accept': '*/*',
      },
      httpAgent: typeof window === 'undefined' ? new (require('http').Agent)({ keepAlive: true }) : undefined,
      httpsAgent,
    })

    // Interceptor de request para incluir token de autenticación
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            const token = localStorage.getItem('auth_token')
            if (token) {
              config.headers.Authorization = `Bearer ${token}`
            }
          } catch (e) {
            console.warn('No se pudo acceder al localStorage')
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Interceptor de response para manejo de errores
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            if (isDevelopment) console.warn('🔐 Error 401: Token no válido o expirado')

            if (typeof window !== 'undefined' && window.localStorage) {
              try {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
                localStorage.removeItem('sport_center_id')
                // Redirigir al home para que NextAuth maneje el login
                window.location.href = '/'
              } catch (e) {
                console.warn('No se pudo limpiar localStorage')
              }
            }
          }

          if (isDevelopment) {
            if (error.response) {
              console.error(`❌ API Error (${error.response.status}):`, error.response.data)
            } else if (error.request) {
              console.error('❌ API Error: No se recibió respuesta', error.message)
            } else {
              console.error('❌ API Error:', error.message)
            }
          }
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Obtiene el token actual desde localStorage
   */
  private getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return localStorage.getItem('auth_token')
      } catch (e) {
        console.warn('No se pudo acceder al localStorage')
        return null
      }
    }
    return null
  }

  /**
   * Verifica si hay un token válido disponible
   */
  hasValidToken(): boolean {
    const token = this.getToken()
    return !!token && token.length > 0
  }
  

  /**
   * GET request
   */
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get(url, {
        timeout: config?.timeout || this.timeout,
        headers: config?.headers,
      })
      return {
        data: response.data,
        error: null,
        status: response.status,
      }
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  /**
   * POST request
   */
  async post<T>(url: string, body: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post(url, body, {
        timeout: config?.timeout || this.timeout,
        headers: config?.headers,
      })
      return {
        data: response.data,
        error: null,
        status: response.status,
      }
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  /**
   * PUT request
   */
  async put<T>(url: string, body: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put(url, body, {
        timeout: config?.timeout || this.timeout,
        headers: config?.headers,
      })
      return {
        data: response.data,
        error: null,
        status: response.status,
      }
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(url, {
        timeout: config?.timeout || this.timeout,
        headers: config?.headers,
      })
      return {
        data: response.data,
        error: null,
        status: response.status,
      }
    } catch (error) {
      return this.handleError<T>(error)
    }
  }

  /**
   * Limpia todos los datos de autenticación
   */
  clearAuth(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('sport_center_id')
      } catch (e) {
        console.warn('No se pudo limpiar localStorage:', e)
      }
    }
  }


  /**
   * Manejo centralizado de errores
   */
  private handleError<T>(error: unknown): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          data: null,
          error: error.response.data?.message || error.response.data?.title || error.message || `Error ${error.response.status}`,
          status: error.response.status,
          errors: error.response.data?.errors,
        }
      } else if (error.request) {
        return {
          data: null,
          error: 'No se recibió respuesta del servidor',
          status: 0,
        }
      }
    }

    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error desconocido',
      status: 500,
    }
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient()
