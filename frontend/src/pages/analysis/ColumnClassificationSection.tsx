import React, { useState } from 'react'
import { 
  Hash, 
  FileText, 
  ToggleLeft, 
  Calendar, 
  Target, 
  Fingerprint,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ClassificationData {
  identifier: string[]
  numeric: string[]
  categorical: string[]
  boolean: string[]
  datetime: string[]
  target_candidate: string[]
}

interface ColumnClassificationSectionProps {
  data: ClassificationData
  className?: string
}

const classificationConfig = {
  identifier: { icon: Fingerprint, label: 'Identifier', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
  numeric: { icon: Hash, label: 'Numeric', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
  categorical: { icon: FileText, label: 'Categorical', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
  boolean: { icon: ToggleLeft, label: 'Boolean', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' },
  datetime: { icon: Calendar, label: 'Datetime', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
  target_candidate: { icon: Target, label: 'Target Candidate', color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400' },
}

const ColumnClassificationSection: React.FC<ColumnClassificationSectionProps> = ({
  data,
  className,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalColumns = Object.values(data).reduce((acc, arr) => acc + arr.length, 0)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Hash className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Column Classification</h3>
        <Badge variant="info" size="sm">{totalColumns} Total</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(classificationConfig).map(([key, config]) => {
          const columns = data[key as keyof ClassificationData] || []
          const isExpanded = expanded[key] || false

          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(key)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', config.color)}>
                    <config.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{config.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{columns.length} columns</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {isExpanded && columns.length > 0 && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-wrap gap-1.5">
                    {columns.map((col) => (
                      <span
                        key={col}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ColumnClassificationSection
