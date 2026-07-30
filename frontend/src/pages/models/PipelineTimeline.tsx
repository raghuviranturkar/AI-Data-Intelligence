import React from 'react'
import { CheckCircle, Target, Filter, Settings, Brain, BarChart3, Crown } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PipelineStep {
  id: string
  label: string
  icon: React.ReactNode
  status: 'completed' | 'running' | 'pending'
}

const steps: PipelineStep[] = [
  { id: 'target', label: 'Target Detection', icon: <Target className="h-5 w-5" />, status: 'completed' },
  { id: 'feature', label: 'Feature Selection', icon: <Filter className="h-5 w-5" />, status: 'completed' },
  { id: 'preprocessing', label: 'Preprocessing', icon: <Settings className="h-5 w-5" />, status: 'completed' },
  { id: 'train', label: 'Train Models', icon: <Brain className="h-5 w-5" />, status: 'completed' },
  { id: 'evaluate', label: 'Evaluate', icon: <BarChart3 className="h-5 w-5" />, status: 'completed' },
  { id: 'rank', label: 'Rank Models', icon: <Crown className="h-5 w-5" />, status: 'completed' },
  { id: 'best', label: 'Best Model', icon: <CheckCircle className="h-5 w-5" />, status: 'completed' },
]

const PipelineTimeline: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">AutoML Pipeline</h3>
      <div className="flex items-center justify-between overflow-x-auto py-2">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted
                      ? 'border-success-500 bg-success-50 dark:bg-success-900/30 text-success-500 dark:text-success-400'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  )}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : step.icon}
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium',
                    isCompleted
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-6 md:w-12',
                    isCompleted ? 'bg-success-500 dark:bg-success-400' : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex justify-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ✓ All stages completed successfully
        </span>
      </div>
    </div>
  )
}

export default PipelineTimeline
