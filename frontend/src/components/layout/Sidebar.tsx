import React, { useState, useEffect } from 'react'
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
  ChevronLeft,
  ChevronRight,
  Shield,
  Lightbulb
} from 'lucide-react'
import { cn } from '../../utils/cn'

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

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed))
  }, [collapsed])

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          'flex h-16 items-center border-b border-gray-200 dark:border-gray-800 transition-all duration-300',
          collapsed ? 'justify-center px-2' : 'gap-2 px-6'
        )}>
          <Database className="h-8 w-8 text-primary-600 flex-shrink-0" />
          {!collapsed && (
            <span className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">AI Data Intel</span>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110',
            collapsed && 'rotate-180'
          )}
        >
          <ChevronLeft className="h-3 w-3" />
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'sidebar-link relative',
                  isActive && 'active',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
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
