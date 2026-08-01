import React from 'react'
import { Settings, Save, RotateCcw } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

interface SettingsHeaderProps {
  onSave: () => void
  onReset: () => void
  hasUnsavedChanges: boolean
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onSave,
  onReset,
  hasUnsavedChanges,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 sticky top-16 z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <Settings className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure your workspace, preferences, and analysis options.
            </p>
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm" className="mt-1">
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Save className="h-4 w-4" />}
            onClick={onSave}
          >
            Save Changes
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={onReset}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsHeader
