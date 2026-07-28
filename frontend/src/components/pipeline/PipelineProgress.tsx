import React from 'react'
import { cn } from '../../utils/cn'
import { Check, Loader2 } from 'lucide-react'

export interface PipelineStep {
  id: string
  label: string
  status: 'waiting' | 'running' | 'completed' | 'error'
}

interface PipelineProgressProps {
  steps: PipelineStep[]
  currentStep?: number
  className?: string
}

const PipelineProgress: React.FC<PipelineProgressProps> = ({
  steps,
  currentStep = 0,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isCompleted = step.status === 'completed'
            const isRunning = step.status === 'running'
            const isError = step.status === 'error'
            const isWaiting = step.status === 'waiting'

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Status Icon */}
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  {isCompleted ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-500 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  ) : isRunning ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : isError ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-500 text-white">
                      <span className="text-lg font-bold">!</span>
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-400">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isCompleted
                          ? 'text-gray-900'
                          : isRunning
                          ? 'text-primary-600'
                          : isError
                          ? 'text-danger-600'
                          : 'text-gray-400'
                      )}
                    >
                      {step.label}
                    </p>
                    {isWaiting && (
                      <span className="text-xs text-gray-400">Pending</span>
                    )}
                    {isRunning && (
                      <span className="text-xs text-primary-600 font-medium">Running...</span>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-success-600 font-medium">Complete ✓</span>
                    )}
                    {isError && (
                      <span className="text-xs text-danger-600 font-medium">Error!</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PipelineProgress
