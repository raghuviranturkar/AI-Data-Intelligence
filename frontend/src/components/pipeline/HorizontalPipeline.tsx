import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Database,
  Brush,
  BarChart3,
  Settings,
  Brain,
  Shield,
  Lightbulb,
  FileText
} from 'lucide-react'
import { cn } from '../../utils/cn'

export interface PipelineStage {
  id: string
  label: string
  icon: React.ReactNode
  status: 'waiting' | 'running' | 'completed' | 'error'
  progress?: number
}

interface HorizontalPipelineProps {
  stages: PipelineStage[]
  currentStage?: number
  overallProgress?: number
  className?: string
}

const HorizontalPipeline: React.FC<HorizontalPipelineProps> = ({
  stages,
  currentStage = 0,
  overallProgress = 0,
  className,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setProgress(overallProgress)
  }, [overallProgress])

  return (
    <div className={cn('w-full bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300', className)}>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pipeline Progress</span>
          <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill bg-primary-600 dark:bg-primary-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="relative flex items-center justify-between overflow-x-auto py-4">
        {stages.map((stage, index) => {
          const isCompleted = stage.status === 'completed'
          const isRunning = stage.status === 'running'
          const isError = stage.status === 'error'
          const isWaiting = stage.status === 'waiting'

          return (
            <div key={stage.id} className="flex flex-col items-center flex-shrink-0">
              {/* Stage Icon */}
              <div className="relative">
                <motion.div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted
                      ? 'border-success-500 bg-success-50 dark:bg-success-900/30 text-success-500 dark:text-success-400'
                      : isRunning
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400'
                      : isError
                      ? 'border-danger-500 bg-danger-50 dark:bg-danger-900/30 text-danger-500 dark:text-danger-400'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : isRunning ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : isError ? (
                    <AlertCircle className="h-6 w-6" />
                  ) : (
                    <div className="h-6 w-6">{stage.icon}</div>
                  )}
                </motion.div>

                {/* Connecting Line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-full top-1/2 w-[calc(100%-1rem)] -translate-y-1/2">
                    <motion.div
                      className={cn(
                        'h-0.5 w-full transition-colors duration-300',
                        isCompleted ? 'bg-success-500 dark:bg-success-400' : 'bg-gray-200 dark:bg-gray-700'
                      )}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                )}
              </div>

              {/* Stage Label */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-xs font-medium transition-colors duration-300',
                    isCompleted
                      ? 'text-success-600 dark:text-success-400'
                      : isRunning
                      ? 'text-primary-600 dark:text-primary-400'
                      : isError
                      ? 'text-danger-600 dark:text-danger-400'
                      : 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {stage.label}
                </p>
                {isRunning && (
                  <p className="text-[10px] text-primary-400 dark:text-primary-500">Processing...</p>
                )}
                {isCompleted && (
                  <p className="text-[10px] text-success-400 dark:text-success-500">✓ Done</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HorizontalPipeline
