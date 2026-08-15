import React, { useEffect, useState } from 'react'
import { CheckCircle, Target, Filter, Settings, Brain, BarChart3, Crown } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PipelineStep {
  id: string
  label: string
  icon: React.ReactNode
  status: 'completed' | 'running' | 'pending'
}

const steps: PipelineStep[] = [
  { id: 'target', label: 'Target Detection', icon: <Target className="h-4 w-4" />, status: 'completed' },
  { id: 'feature', label: 'Feature Selection', icon: <Filter className="h-4 w-4" />, status: 'completed' },
  { id: 'preprocessing', label: 'Preprocessing', icon: <Settings className="h-4 w-4" />, status: 'completed' },
  { id: 'train', label: 'Train Models', icon: <Brain className="h-4 w-4" />, status: 'completed' },
  { id: 'evaluate', label: 'Evaluate', icon: <BarChart3 className="h-4 w-4" />, status: 'completed' },
  { id: 'rank', label: 'Rank Models', icon: <Crown className="h-4 w-4" />, status: 'completed' },
  { id: 'best', label: 'Best Model', icon: <CheckCircle className="h-4 w-4" />, status: 'completed' },
]

const PipelineTimeline: React.FC = () => {
  const [isDark, setIsDark] = useState(false)

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
    border: isDark ? '#232B35' : '#E2E8F0',
    panel: isDark ? '#12181F' : '#FFFFFF',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      teal: '#3ECF8E',
    }
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: isDark ? '#0B0F14' : '#F8FAFC',
            borderColor: colors.border
          }}
        >
          <Brain className="h-4 w-4" style={{ color: colors.accent.teal }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>AutoML Pipeline</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· Sequential execution</span>
      </div>

      <div className="flex items-center justify-between overflow-x-auto py-2">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md border-2 transition-all duration-300',
                    isCompleted
                      ? 'border-[#3ECF8E] bg-[#3ECF8E]/10 text-[#3ECF8E]'
                      : 'border-[#232B35] bg-[#0B0F14] text-[#4A5563]'
                  )}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-mono',
                    isCompleted
                      ? 'text-[#3ECF8E]'
                      : 'text-[#4A5563]'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-6 md:w-12',
                    isCompleted ? 'bg-[#3ECF8E]' : 'bg-[#232B35]'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex justify-center">
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
          ✓ All stages completed successfully
        </span>
      </div>
    </div>
  )
}

export default PipelineTimeline
