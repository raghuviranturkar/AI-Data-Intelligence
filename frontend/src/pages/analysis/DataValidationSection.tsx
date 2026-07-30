import React from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ValidationItem {
  label: string
  value: string | number | boolean
  status: 'success' | 'warning' | 'error' | 'info'
}

interface DataValidationSectionProps {
  items: ValidationItem[]
  warnings?: string[]
  className?: string
}

const DataValidationSection: React.FC<DataValidationSectionProps> = ({
  items,
  warnings = [],
  className,
}) => {
  const getStatusIcon = (status: ValidationItem['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-success-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-warning-500" />
      case 'error': return <XCircle className="h-5 w-5 text-danger-500" />
      default: return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusColor = (status: ValidationItem['status']) => {
    switch (status) {
      case 'success': return 'border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/20'
      case 'warning': return 'border-warning-200 dark:border-warning-800 bg-warning-50 dark:bg-warning-900/20'
      case 'error': return 'border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20'
      default: return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Validation</h3>
        <Badge variant="info" size="sm">{items.length} Checks</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'rounded-lg border p-4 transition-colors duration-200',
              getStatusColor(item.status)
            )}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(item.status)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  {typeof item.value === 'boolean' 
                    ? item.value ? 'Passed' : 'Failed' 
                    : String(item.value)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {warnings.length > 0 && (
        <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4 border border-warning-200 dark:border-warning-800">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning-700 dark:text-warning-400">Validation Warnings</p>
              <ul className="mt-1 space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300">• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataValidationSection
