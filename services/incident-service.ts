import { apiClient } from '@/lib/api/client'
import { IIncident } from '@/models/incidents'
import { ApiResponse } from '@/types/api'

export type IncidentStatusResponse = {
  incident_id: string
  status?: string
  status_step?: string
  status_message?: string
  status_updated_at?: string
}
/**
 * Obtiene todos los incidentes con paginación
 * GET /incidents/all?skip=0&limit=10
 */
export async function getIncidentsAll(skip: number = 0, limit: number = 10): Promise<ApiResponse<IIncident[]>> {
  const response = await apiClient.get(`/incidents/all?skip=${skip}&limit=${limit}`)
  return {
    data: response.data as IIncident[],
    error: response.error,
    status: response.status,
  }
}

export async function getIncidentsById(id: string): Promise<ApiResponse<IIncident>> {
  const response = await apiClient.get('/incidents/' + id)
  return {
    data: response.data as IIncident,
    error: response.error,
    status: response.status,
  }
}

/**
 * Obtiene un incidente por id (nuevo API)
 * Nota: el baseURL (NEXT_PUBLIC_API_BASE_URL) ya incluye `/api`.
 * Por eso acá usamos `/incidents/{id}` y NO `/api/incidents/{id}`.
 * GET /api/incidents/{id}
 */
export async function getIncidentByIdApi(id: string): Promise<ApiResponse<IIncident>> {
  const response = await apiClient.get(`/incidents/${id}`)
  return {
    data: response.data as IIncident,
    error: response.error,
    status: response.status,
  }
}

/**
 * Estado liviano del reproceso (polling)
 * Nota: el baseURL (NEXT_PUBLIC_API_BASE_URL) ya incluye `/api`.
 * GET /api/incidents/{incident_id}/status
 */
export async function getIncidentStatusApi(id: string): Promise<ApiResponse<IncidentStatusResponse>> {
  const safeId = encodeURIComponent(id)
  const response = await apiClient.get(`/incidents/${safeId}/status`)
  return {
    data: response.data as IncidentStatusResponse,
    error: response.error,
    status: response.status,
  }
}

/**
 * Reprocesa análisis de IA en segundo plano
 * Nota: el baseURL (NEXT_PUBLIC_API_BASE_URL) ya incluye `/api`.
 * Por eso acá usamos `/incidents/reprocess?...` y NO `/api/incidents/reprocess?...`.
 * POST /api/incidents/reprocess?incident_id={id}
 */
export async function reprocessIncident(
  id: string,
  options?: { target_language?: string }
): Promise<ApiResponse<boolean>> {
  const body = options?.target_language ? { target_language: options.target_language } : {}
  const response = await apiClient.post(`/incidents/reprocess?incident_id=${encodeURIComponent(id)}`, body)
  return {
    data: response.data as boolean,
    error: response.error,
    status: response.status,
  }
}

export async function createIncident(incident: IIncident): Promise<ApiResponse<IIncident>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''

  const headers: any = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'text/plain',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const formData = new FormData()
  for (let i = 0; i < incident.multimedias.length; i++) {
    const img = incident.multimedias[i]
    if (img.file){
      formData.append("files", img.file);
    }
  }

  formData.append("incident_data", JSON.stringify(incident))

  try {
    const response = await apiClient.post('/incidents/create', formData, {
        headers: headers,
      }) 

    return {
      data: response.data as IIncident,
      error: response.error,
      status: response.status,
    }
  } catch (error) {
    console.warn('No se pudo crear el incidente:', error)
    throw error
  }  
}

export async function updateIncident(incident: IIncident): Promise<ApiResponse<IIncident>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''

  const headers: any = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'text/plain',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const formData = new FormData()
  // for (let i = 0; i < incident.multimedias.length; i++) {
  //   const img = incident.multimedias[i]
  //   if (img.file){
  //     formData.append("files", img.file);
  //   }
  // }

  formData.append("incident_data", JSON.stringify(incident))

  try {
    const response = await apiClient.post('/incidents/update', formData, {
        headers: headers,
      }) 

    return {
      data: response.data as IIncident,
      error: response.error,
      status: response.status,
    }
  } catch (error) {
    console.warn('No se pudo guardar el actualizar el incidente:', error)
    throw error
  }  
}