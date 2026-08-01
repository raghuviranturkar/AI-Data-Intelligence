import React from 'react'
import { Database, AlertTriangle, Filter, Scale, Clock } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface DataProcessingProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const DataProcessing: React.FC<DataProcessingProps> = ({
  settings,
  onSettingChange,
}) => {
  const strategies = {
    missing: ['mean', 'median', 'mode', 'drop'],
    outlier: ['iqr', 'zscore', 'isolation_forest'],
    encoding: ['one_hot', 'label', 'target', 'frequency'],
    scaling: ['standard', 'minmax', 'robust'],
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Processing</h3>
        <Badge variant="warning" size="sm">Future Config</Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Missing Value Strategy
            </label>
            <select
              value={settings.missingValueStrategy}
              onChange={(e) => onSettingChange('missingValueStrategy', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              {strategies.missing.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">⚠️ Not yet active</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Outlier Strategy
            </label>
            <select
              value={settings.outlierStrategy}
              onChange={(e) => onSettingChange('outlierStrategy', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              {strategies.outlier.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">⚠️ Not yet active</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Encoding Strategy
            </label>
            <select
              value={settings.encodingStrategy}
              onChange={(e) => onSettingChange('encodingStrategy', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              {strategies.encoding.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">⚠️ Not yet active</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Scaling Strategy
            </label>
            <select
              value={settings.scalingStrategy}
              onChange={(e) => onSettingChange('scalingStrategy', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              {strategies.scaling.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">⚠️ Not yet active</p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ These settings are placeholders for future implementation. The backend currently uses default strategies.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DataProcessing
