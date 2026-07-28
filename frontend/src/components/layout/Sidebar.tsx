import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  FileText, 
  Brain,
  Settings,
  Database,
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react'
import { cn } from '../../utils/cn'

interface SidebarProps {
  collapsed: boolean
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Analysis', href: '/analysis', icon: BarChart3 },
  { name: 'Visualizations', href: '/visualizations', icon: TrendingUp },
  { name: 'Models', href: '/models', icon: Brain },
  { name: 'Explainability', href: '/explainability', icon: Shield },
  { name: 'AI Insights', href: '/insights', icon: Lightbulb },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation()

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Logo */}
        <div className={cn(
          'flex h-16 items-center border-b border-gray-200 dark:border-gray-800 transition-all duration-300 flex-shrink-0',
          collapsed ? 'justify-center px-2' : 'gap-2 px-6'
        )}>
          <Database className="h-8 w-8 text-primary-600 flex-shrink-0" />
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">AI Data Intel</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
                    collapsed ? 'justify-center px-0' : 'gap-3'
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 flex-shrink-0">
          <div className={cn(
            'rounded-lg bg-primary-50 dark:bg-primary-900/20 p-3 transition-all duration-300',
            collapsed && 'flex justify-center'
          )}>
            {!collapsed ? (
              <>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pipeline Status</p>
                <p className="text-sm font-medium text-primary-700 dark:text-primary-400">✓ Ready</p>
              </>
            ) : (
              <div className="h-2 w-2 rounded-full bg-success-500" />
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
