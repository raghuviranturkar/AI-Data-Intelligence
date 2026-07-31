import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Store session ID from upload response
let sessionId: string | null = null

export const setSessionId = (id: string) => {
  sessionId = id
  localStorage.setItem('reportSessionId', id)
}

export const getSessionId = (): string | null => {
  if (!sessionId) {
    sessionId = localStorage.getItem('reportSessionId')
  }
  return sessionId
}

export const downloadAndSaveReport = async (format: 'pdf' | 'html' | 'markdown') => {
  const id = getSessionId()
  if (!id) {
    return { 
      success: false, 
      error: 'No session ID found. Please upload a dataset first.' 
    }
  }

  // Map frontend format to backend endpoint
  const endpointMap = {
    pdf: `/reports/pdf?session_id=${id}`,
    html: `/reports/html?session_id=${id}`,
    markdown: `/reports/md?session_id=${id}`,
  }

  const fileExtensions = {
    pdf: 'pdf',
    html: 'html',
    markdown: 'md',
  }

  try {
    const response = await axios.get(`${API_BASE_URL}${endpointMap[format]}`, {
      responseType: 'blob',
    })
    
    const blob = response.data
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analysis_report.${fileExtensions[format]}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return { success: true }
  } catch (error: any) {
    console.error(`Failed to download ${format} report:`, error)
    return { 
      success: false, 
      error: error.response?.data?.detail || error.message || 'Download failed. Please try again.' 
    }
  }
}

export default {
  downloadAndSaveReport,
  setSessionId,
  getSessionId,
}
