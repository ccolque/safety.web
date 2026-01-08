import { apiClient } from '@/lib/api/client'
import {  STATUS } from '@/lib/constants'
import { IStatus } from '@/models/status'
import { ApiResponse } from '@/types/api'

export async function getStatusAll(): Promise<ApiResponse<IStatus[]>> {
  // const response = await apiClient.get('/severities')
  return {
    data: STATUS as IStatus[],
    error: "",//response.error,
    status: 200//response.status,
  }
}
