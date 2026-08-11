import api from './api'

export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const response = await api.post('/assistant/chat', { message })
    return response.data.response
  } catch (error: any) {
    console.error('Chat API error:', error)
    if (error.response?.status === 404) {
      return 'The chat service is not available. Please ensure the backend is running.'
    }
    throw new Error(error.response?.data?.detail || 'Failed to get response from AI assistant')
  }
}
