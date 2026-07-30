import React from 'react'
import { Target, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface TargetDetectionSectionProps {
  target: string
  confidence: number
  problemType: string
  reason: string
  alternatives: string[]
  className?: string
}

const TargetDetectionSection: React.FC<TargetDetectionSectionProps> = ({
  target,
  confidence,
  problemType,
  reason,
  alternatives,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Target Detection</h3>
        <Badge variant="success" size="sm">Detected</Badge>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{target}</p>
              <Badge variant="success" size="sm">Primary Target</Badge>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Problem Type</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{problemType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant="success" size="md">Valid Target</Badge>
              </div>
            </div>
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">{reason}</p>
            </div>
          </div>
        </div>

        {alternatives.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Alternative Candidates</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {alternatives.map((alt) => (
                <Badge key={alt} variant="default" size="md">
                  {alt}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TargetDetectionSection
