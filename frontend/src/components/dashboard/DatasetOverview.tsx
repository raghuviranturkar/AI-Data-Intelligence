import React from 'react'
import { 
  Database, 
  Table, 
  Hash, 
  FileText, 
  Copy, 
  AlertTriangle, 
  HardDrive,
  CheckCircle,
  TrendingUp,
  Layers,
  BarChart3
} from 'lucide-react'
import { Badge } from '../common/Badge'
import { cn } from '../../utils/cn'

interface KPIItem {
  label: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
  color?: string
  badge?: { text: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }
  trend?: { value: number; direction: 'up' | 'down' | 'neutral' }
}

interface DatasetOverviewProps {
  rows: number
  columns: number
  numericFeatures: number
  categoricalFeatures: number
  duplicateRows: number
  missingCells: number
  memoryUsage: string
  mlReadiness: string
}

const KPI_CARD_STYLES = {
  base: 'group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1',
  icon: 'flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
}

const DatasetOverview: React.FC<DatasetOverviewProps> = ({
  rows,
  columns,
  numericFeatures,
  categoricalFeatures,
  duplicateRows,
  missingCells,
  memoryUsage,
  mlReadiness,
}) => {
  const items: KPIItem[] = [
    {
      label: 'Total Rows',
      value: rows.toLocaleString(),
      icon: <Database className="h-5 w-5" />,
      subtitle: 'Dataset Records',
    },
    {
      label: 'Total Columns',
      value: columns.toLocaleString(),
      icon: <Table className="h-5 w-5" />,
      subtitle: 'Features Detected',
    },
    {
      label: 'Numeric Features',
      value: numericFeatures.toLocaleString(),
      icon: <Hash className="h-5 w-5" />,
      subtitle: 'Continuous Variables',
    },
    {
      label: 'Categorical Features',
      value: categoricalFeatures.toLocaleString(),
      icon: <FileText className="h-5 w-5" />,
      subtitle: 'Discrete Variables',
    },
    {
      label: 'Duplicate Rows',
      value: duplicateRows.toLocaleString(),
      icon: <Copy className="h-5 w-5" />,
      subtitle: duplicateRows > 0 ? 'Remove duplicates' : 'Clean dataset',
      color: duplicateRows > 0 ? 'text-warning-500' : 'text-success-500',
      badge: duplicateRows > 0 
        ? { text: 'Warning', variant: 'warning' as const }
        : { text: 'Clean', variant: 'success' as const },
    },
    {
      label: 'Missing Cells',
      value: missingCells.toLocaleString(),
      icon: <AlertTriangle className="h-5 w-5" />,
      subtitle: missingCells > 0 ? 'Impute missing values' : 'Complete dataset',
      color: missingCells > 0 ? 'text-warning-500' : 'text-success-500',
      badge: missingCells > 0 
        ? { text: 'Needs Review', variant: 'warning' as const }
        : { text: 'Complete', variant: 'success' as const },
    },
    {
      label: 'Memory Usage',
      value: memoryUsage,
      icon: <HardDrive className="h-5 w-5" />,
      subtitle: 'Dataset Size',
    },
    {
      label: 'ML Readiness',
      value: mlReadiness,
      icon: <CheckCircle className="h-5 w-5" />,
      subtitle: mlReadiness === 'Ready' ? 'Ready for modeling' : 'Needs preprocessing',
      color: mlReadiness === 'Ready' ? 'text-success-500' : 'text-warning-500',
      badge: mlReadiness === 'Ready'
        ? { text: 'Ready', variant: 'success' as const }
        : { text: 'Needs Work', variant: 'warning' as const },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Dataset Overview</h3>
        <Badge variant="info" size="sm">8 Metrics</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.label} className={cn(KPI_CARD_STYLES.base, 'cursor-default')}>
            <div className="flex items-start justify-between">
              <div className={cn(KPI_CARD_STYLES.icon, item.color)}>
                {item.icon}
              </div>
              {item.badge && (
                <Badge variant={item.badge.variant} size="sm">
                  {item.badge.text}
                </Badge>
              )}
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DatasetOverview
