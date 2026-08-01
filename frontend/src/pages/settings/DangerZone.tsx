import React from 'react'
import { AlertTriangle, Trash2, RefreshCcw, XCircle } from 'lucide-react'
import { Button } from '../../components/common/Button'

const DangerZone: React.FC = () => {
  const handleAction = (action: string) => {
    if (confirm(`Are you sure you want to ${action}? This action cannot be undone.`)) {
      console.log(`Performing ${action}...`)
    }
  }

  return (
    <div className="bg-danger-50 dark:bg-danger-900/10 border-2 border-danger-200 dark:border-danger-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-danger-600 dark:text-danger-400" />
        <h3 className="text-lg font-semibold text-danger-700 dark:text-danger-400">Danger Zone</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-danger-200 dark:border-danger-800">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Clear Current Session</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Remove all current analysis data</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => handleAction('clear session')}
          >
            Clear
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-danger-200 dark:border-danger-800">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Remove Cached Data</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Clear all cached files and results</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<RefreshCcw className="h-4 w-4" />}
            onClick={() => handleAction('remove cached data')}
          >
            Remove
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-danger-200 dark:border-danger-800">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Reset Settings</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Restore all settings to defaults</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<XCircle className="h-4 w-4" />}
            onClick={() => handleAction('reset settings')}
          >
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-danger-200 dark:border-danger-800 opacity-50 cursor-not-allowed">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Delete Workspace</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Permanently remove workspace and all data</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-4 w-4" />}
            disabled
          >
            Delete
          </Button>
        </div>

        <p className="text-xs text-danger-600 dark:text-danger-400 mt-2">
          ⚠️ These actions are irreversible. Proceed with caution.
        </p>
      </div>
    </div>
  )
}

export default DangerZone
