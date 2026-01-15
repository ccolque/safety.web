import { apiClient } from '@/lib/api/client'
import { IIncident } from '@/models/incidents'
import { ApiResponse } from '@/types/api'
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
    console.warn('No se pudo guardar el sport_center_id en localStorage:', error)
    throw error
  }  
}