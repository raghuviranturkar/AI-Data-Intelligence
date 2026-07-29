import React from 'react'
import { 
  Database, 
  Table, 
  Hash, 
  FileText, 
  Copy, 
  AlertTriangle, 
  HardDrive,
  CheckCircle
} from 'lucide-react'
import Card from '../common/Card'
import { Badge } from '../common/Badge'

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
  const items = [
    {
      label: 'Rows',
      value: rows.toLocaleString(),
      icon: <Database className="h-4 w-4" />,
    },
    {
      label: 'Columns',
      value: columns.toLocaleString(),
      icon: <Table className="h-4 w-4" />,
    },
    {
      label: 'Numeric Features',
      value: numericFeatures.toLocaleString(),
      icon: <Hash className="h-4 w-4" />,
    },
    {
      label: 'Categorical Features',
      value: categoricalFeatures.toLocaleString(),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: 'Duplicate Rows',
      value: duplicateRows.toLocaleString(),
      icon: <Copy className="h-4 w-4" />,
      color: duplicateRows > 0 ? 'text-warning-500' : 'text-success-500',
    },
    {
      label: 'Missing Cells',
      value: missingCells.toLocaleString(),
      icon: <AlertTriangle className="h-4 w-4" />,
      color: missingCells > 0 ? 'text-warning-500' : 'text-success-500',
    },
    {
      label: 'Memory Usage',
      value: memoryUsage,
      icon: <HardDrive className="h-4 w-4" />,
    },
    {
      label: 'ML Readiness',
      value: mlReadiness,
      icon: <CheckCircle className="h-4 w-4" />,
      color: mlReadiness === 'Ready' ? 'text-success-500' : 'text-warning-500',
      badge: true,
    },
  ]

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dataset Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className={`${item.color || 'text-gray-400 dark:text-gray-500'}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <div className="flex items-center gap-1">
                <span className={`font-semibold text-gray-900 dark:text-white ${item.color || ''}`}>
                  {item.value}
                </span>
                {item.badge && (
                  <Badge variant={mlReadiness === 'Ready' ? 'success' : 'warning'} size="sm">
                    {mlReadiness}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default DatasetOverview
