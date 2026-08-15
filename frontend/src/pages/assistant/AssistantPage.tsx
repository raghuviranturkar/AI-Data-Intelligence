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
  MessageSquare,
  Zap,
  ArrowRight,
  Brain,
  Lightbulb,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'
import { motion, AnimatePresence } from 'framer-motion'

// Import the chat service
import { sendChatMessage } from '../../services/chatService'

// Simple markdown renderer with better formatting
const renderMarkdown = (content: string) => {
  let html = content
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Bullet lists
    .replace(/• /g, '•&nbsp;')

  const lines = html.split('\n')
  let inList = false
  let result = []

  for (let line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('•')) {
      if (!inList) {
        result.push('<ul>')
        inList = true
      }
      result.push(`<li>${trimmed.substring(1).trim()}</li>`)
    } else if (trimmed.startsWith('- ')) {
      if (!inList) {
        result.push('<ul>')
        inList = true
      }
      result.push(`<li>${trimmed.substring(2).trim()}</li>`)
    } else {
      if (inList) {
        result.push('</ul>')
        inList = false
      }
      if (trimmed) {
        result.push(`<p>${trimmed}</p>`)
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
  { text: 'What is the quality of my dataset?', icon: <Database className="h-4 w-4" /> },
  { text: 'Which model performed best?', icon: <Brain className="h-4 w-4" /> },
  { text: 'What are the most important features?', icon: <Lightbulb className="h-4 w-4" /> },
  { text: 'What are the biggest risks in my dataset?', icon: <Zap className="h-4 w-4" /> },
]

const AssistantPage: React.FC = () => {
  const { data } = useData()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDark, setIsDark] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Check dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const colors = {
    bg: isDark ? '#0B0F14' : '#F1F4F8',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    border: isDark ? '#232B35' : '#E2E8F0',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      azure: '#4EA1F0',
      purple: '#B48CF2',
    }
  }

  const gridBgStyle = isDark 
    ? {
        backgroundImage: 'linear-gradient(to right, rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,241,245,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }
    : {
        backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }

  const hasData = !!data
  const dataset = data?.dataset || {}
  const datasetName = dataset?.file_name || 'Unknown dataset'
  const rows = dataset?.shape?.rows || 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px'
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
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
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

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!hasData) {
    return (
      <div 
        className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
        style={{ backgroundColor: colors.bg, ...gridBgStyle }}
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div 
            className="p-4 rounded-md border mb-4"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <Bot className="h-16 w-16" style={{ color: colors.textMuted }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: colors.text }}>No Dataset Available</h2>
          <p className="text-sm font-mono mt-2 max-w-md" style={{ color: colors.textMuted }}>
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
    <div 
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-6xl mx-auto w-full relative z-10 h-[calc(100vh-2rem)] gap-4 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border p-5 transition-colors duration-300 flex-shrink-0"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div 
                className="p-2.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Bot className="h-6 w-6" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: colors.text }}>
                  AI Assistant
                </h1>
                <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
                  Ask questions about your data and analysis results
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
        </motion.div>

        {/* Chat Container - Full width, spacious */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-lg border overflow-hidden flex flex-col flex-1 min-h-0 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          {/* Messages - Scrollable with proper spacing */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <div 
                  className="p-4 rounded-md border mb-6"
                  style={{ 
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border
                  }}
                >
                  <MessageSquare className="h-10 w-10" style={{ color: colors.accent.amber }} />
                </div>
                <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
                  How can I help you today?
                </h3>
                <p className="text-sm font-mono mt-2 max-w-lg" style={{ color: colors.textMuted }}>
                  Ask me anything about your dataset — I can help with data quality, model performance, 
                  feature importance, risks, and recommendations.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex gap-4',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {/* Avatar */}
                    {message.role === 'assistant' && (
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center border mt-1"
                        style={{ 
                          backgroundColor: colors.panelAlt,
                          borderColor: colors.border
                        }}
                      >
                        <Bot className="h-5 w-5" style={{ color: colors.accent.amber }} />
                      </div>
                    )}

                    {/* Message Content */}
                    <div 
                      className={cn(
                        'max-w-[80%] rounded-lg px-5 py-4 border',
                        message.role === 'user'
                          ? 'border-transparent'
                          : ''
                      )}
                      style={{
                        backgroundColor: message.role === 'user' 
                          ? colors.accent.amber 
                          : colors.panelAlt,
                        borderColor: message.role === 'user' 
                          ? colors.accent.amber 
                          : colors.border,
                        color: message.role === 'user' 
                          ? '#FFFFFF' 
                          : colors.text,
                      }}
                    >
                      {message.role === 'assistant' ? (
                        <>
                          <div
                            className="text-[15px] leading-relaxed prose prose-sm max-w-none"
                            style={{
                              color: colors.text,
                            }}
                            dangerouslySetInnerHTML={{ 
                              __html: renderMarkdown(message.content) 
                            }}
                          />
                          <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className="text-xs font-mono flex items-center gap-1.5 transition-colors"
                              style={{ color: colors.textMuted }}
                            >
                              {copiedId === message.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5" style={{ color: colors.accent.teal }} />
                                  <span style={{ color: colors.accent.teal }}>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  Copy
                                </>
                              )}
                            </button>
                            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
                            <button className="text-xs font-mono flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: colors.textMuted }}>
                              <ThumbsUp className="h-3.5 w-3.5" />
                              Helpful
                            </button>
                            <button className="text-xs font-mono flex items-center gap-1.5 transition-colors hover:opacity-80" style={{ color: colors.textMuted }}>
                              <ThumbsDown className="h-3.5 w-3.5" />
                              Not helpful
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p
                        className={cn(
                          'text-[11px] font-mono mt-2',
                          message.role === 'user'
                            ? 'opacity-70'
                            : ''
                        )}
                        style={{
                          color: message.role === 'user' 
                            ? 'rgba(255,255,255,0.7)' 
                            : colors.textDim,
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* User Avatar */}
                    {message.role === 'user' && (
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center border mt-1"
                        style={{ 
                          backgroundColor: colors.panelAlt,
                          borderColor: colors.border
                        }}
                      >
                        <User className="h-5 w-5" style={{ color: colors.textMuted }} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center border"
                  style={{ 
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border
                  }}
                >
                  <Bot className="h-5 w-5" style={{ color: colors.accent.amber }} />
                </div>
                <div 
                  className="rounded-lg px-5 py-4 border"
                  style={{ 
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin" style={{ color: colors.accent.amber }} />
                    <span className="text-sm font-mono" style={{ color: colors.textMuted }}>Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center border"
                  style={{ 
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border
                  }}
                >
                  <Bot className="h-5 w-5" style={{ color: colors.accent.amber }} />
                </div>
                <div 
                  className="rounded-lg px-5 py-4 border"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(242,85,90,0.08)' : '#FEF2F2',
                    borderColor: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA',
                  }}
                >
                  <p className="text-sm font-mono" style={{ color: colors.accent.coral }}>{error}</p>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Clean and spacious */}
          <div 
            className="border-t p-4 flex-shrink-0 transition-colors duration-300"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.panel
            }}
          >
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your dataset..."
                  className="w-full resize-none rounded-lg border px-4 py-3.5 text-[15px] font-mono min-h-[52px] max-h-[160px] transition-colors focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                  rows={1}
                  disabled={isLoading}
                />
                <div className="absolute bottom-2 right-3 text-[10px] font-mono" style={{ color: colors.textDim }}>
                  {input.length > 0 && `${input.length} chars`}
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-[52px] px-6 font-medium flex-shrink-0"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
            <div className="flex items-center justify-between max-w-4xl mx-auto mt-2">
              <p className="text-[10px] font-mono" style={{ color: colors.textDim }}>
                Enter to send · Shift+Enter for new line
              </p>
              {messages.length > 0 && (
                <p className="text-[10px] font-mono" style={{ color: colors.textDim }}>
                  {messages.length} messages
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Suggested Questions - Only show when no messages */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            <p className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              Suggested Questions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {suggestedQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(q.text)}
                  className="flex items-center gap-3 p-4 rounded-md border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-left group"
                  style={{
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border,
                  }}
                >
                  <span className="flex-shrink-0" style={{ color: colors.accent.amber }}>
                    {q.icon}
                  </span>
                  <span className="text-sm font-mono flex-1" style={{ color: colors.textMuted }}>
                    {q.text}
                  </span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.accent.amber }} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2 flex-shrink-0"
        >
          <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
            © 2026 AI Data Intelligence Platform · v1.0.0
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
              {messages.length} messages
            </span>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono" style={{ color: colors.accent.teal }}>
                Online
              </span>
            </div>
            <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
            <span className="text-xs font-mono" style={{ color: colors.textDim }}>
              <span style={{ color: colors.accent.amber }}>●</span> Powered by AI
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AssistantPage
