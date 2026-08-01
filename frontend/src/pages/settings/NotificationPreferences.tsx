import React from 'react'
import { Bell, CheckCircle, AlertTriangle, FileText, Download, Activity } from 'lucide-react'

interface NotificationPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  settings,
  onSettingChange,
}) => {
  const notifications = [
    { key: 'notificationsSuccess', label: 'Success Notifications', icon: CheckCircle },
    { key: 'notificationsError', label: 'Error Notifications', icon: AlertTriangle },
    { key: 'notificationsAnalysisComplete', label: 'Analysis Complete', icon: Activity },
    { key: 'notificationsReportGenerated', label: 'Report Generated', icon: FileText },
    { key: 'notificationsDownloadComplete', label: 'Downloads Complete', icon: Download },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
      </div>

      <div className="space-y-3">
        {notifications.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <button
              onClick={() => onSettingChange(key, !settings[key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationPreferences
