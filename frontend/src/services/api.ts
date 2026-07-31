import axios from 'axios'
import type { PipelineResult } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const uploadDataset = async (file: File): Promise<PipelineResult> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data.data
}

export const downloadReport = async (sessionId: string, format: 'pdf' | 'html' | 'md'): Promise<void> => {
  try {
    const response = await api.get(`/reports/${format}`, {
      params: { session_id: sessionId },
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    const extensions = {
      pdf: 'pdf',
      html: 'html',
      md: 'md'
    }
    link.setAttribute('download', `analysis_report.${extensions[format]}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    console.error(`Error downloading ${format} report:`, error)
    throw error
  }
}

export default api
