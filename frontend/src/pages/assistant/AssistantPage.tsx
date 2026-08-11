import React, { useState, useRef, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { useNavigate } from 'react-router-dom'
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Sparkles,
  Database,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

// Import the chat service
import { sendChatMessage } from '../../services/chatService'

// Simple markdown renderer
const renderMarkdown = (content: string) => {
  // Convert **bold** to <strong>
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/• /g, '•&nbsp;')
  
  // Handle bullet lists
  const lines = html.split('\n')
  let inList = false
  let result = []
  
  for (let line of lines) {
    if (line.trim().startsWith('•')) {
      if (!inList) {
        result.push('<ul>')
        inList = true
      }
      result.push(`<li>${line.trim().substring(1).trim()}</li>`)
    } else {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      if (line.trim()) {
        result.push(`<p>${line}</p>`)
      }
    }
  }
  if (inList) {
    result.push('</ul>')
  }
  
  return result.join('')
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  { text: 'What is the quality of my dataset?' },
  { text: 'Which model performed best?' },
  { text: 'What are the most important features?' },
  { text: 'What are the biggest risks in my dataset?' },
  { text: 'How can I improve my model?' },
]

const AssistantPage: React.FC = () => {
  const { data, isLoading: dataLoading } = useData()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hasData = !!data
  const dataset = data?.dataset || {}
  const datasetName = dataset?.file_name || 'Unknown dataset'
  const rows = dataset?.shape?.rows || 0
  const cols = dataset?.shape?.columns || 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px'
    }
  }, [input])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await sendChatMessage(trimmed)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate response')
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    textareaRef.current?.focus()
    setTimeout(() => handleSend(), 100)
  }

  if (!hasData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Bot className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Dataset Available</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            Upload a dataset first to ask questions about your data and analysis results.
          </p>
          <Button variant="primary" size="lg" className="mt-6" onClick={() => navigate('/upload')}>
            Upload Dataset
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <Bot className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Data Assistant</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ask questions about your dataset and analysis results
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info" size="sm">
              <Database className="h-3 w-3 inline mr-1" />
              {datasetName}
            </Badge>
            <Badge variant="info" size="sm">
              {rows.toLocaleString()} rows
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ask me anything about your data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-1">
                I can answer questions about data quality, models, features, risks, and recommendations.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <div 
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                    />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary-600 dark:text-primary-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something about your dataset..."
              className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px] max-h-[150px]"
              rows={1}
              disabled={isLoading}
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              icon={<Send className="h-4 w-4" />}
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Suggested Questions</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(q.text)}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <span className="text-primary-600 dark:text-primary-400">•</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AssistantPage
