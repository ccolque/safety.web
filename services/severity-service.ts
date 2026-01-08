import { apiClient } from '@/lib/api/client'
import { SEVERITIES } from '@/lib/constants'
import { ISeverity } from '@/models/severity'
import { ApiResponse } from '@/types/api'
/**
 * Obtiene todos los proyectos en una base
 * GET /severities/all
 */
export async function getSeveritiesAll(): Promise<ApiResponse<ISeverity[]>> {
  // const response = await apiClient.get('/severities')
  return {
    data: SEVERITIES as ISeverity[],
    error: "",//response.error,
    status: 200//response.status,
  }
}
