import React from 'react'
import { 
  Upload, CheckCircle, BarChart3, Settings, Brain, Shield, Lightbulb, FileText 
} from 'lucide-react'
import { cn } from '../../utils/cn'

const steps = [
  { id: 'upload', label: 'Upload', icon: Upload, status: 'completed' },
  { id: 'validation', label: 'Validation', icon: CheckCircle, status: 'completed' },
  { id: 'eda', label: 'EDA', icon: BarChart3, status: 'completed' },
  { id: 'feature', label: 'Feature Eng.', icon: Settings, status: 'completed' },
  { id: 'automl', label: 'AutoML', icon: Brain, status: 'completed' },
  { id: 'explainability', label: 'Explainability', icon: Shield, status: 'completed' },
  { id: 'insights', label: 'AI Insights', icon: Lightbulb, status: 'completed' },
  { id: 'reports', label: 'Reports', icon: FileText, status: 'completed' },
]

const ReportsPipeline: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Report Generation Pipeline</h3>
      <div className="flex items-center justify-between overflow-x-auto py-2">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isLast = index === steps.length - 1
          const Icon = step.icon

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
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium text-center max-w-[60px]',
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
        <span className="text-xs text-success-600 dark:text-success-400">✓ All reports generated successfully</span>
      </div>
    </div>
  )
}

export default ReportsPipeline
