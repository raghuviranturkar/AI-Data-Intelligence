import React, { useEffect, useState } from 'react'
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
  Lightbulb,
  Activity,
  GitBranch,
  User,
  LogOut,
  FolderOpen,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  collapsed: boolean
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Analysis', href: '/analysis', icon: Activity },
  { name: 'Visualizations', href: '/visualizations', icon: TrendingUp },
  { name: 'Models', href: '/models', icon: GitBranch },
  { name: 'Explainability', href: '/explainability', icon: Shield },
  { name: 'AI Insights', href: '/ai-insights', icon: Lightbulb },
  { name: 'AI Assistant', href: '/assistant', icon: Bot },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Workspaces', href: '/workspaces', icon: FolderOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const colors = {
    border: isDark ? '#232B35' : '#E2E8F0',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      azure: '#4EA1F0',
      purple: '#B48CF2',
      coral: '#F2555A',
    }
  }

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Logo Section */}
        <div 
          className={cn(
            'flex h-16 items-center border-b transition-all duration-300 flex-shrink-0',
            collapsed ? 'justify-center px-2' : 'gap-2 px-6'
          )}
          style={{ borderColor: colors.border }}
        >
          <div 
            className="p-1.5 rounded-md border flex-shrink-0"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Database className="h-6 w-6" style={{ color: colors.accent.amber }} />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight" style={{ color: colors.text }}>AI Data Intel</span>
              <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Platform</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 group relative',
                    isActive
                      ? 'text-[#F0A94E]'
                      : 'hover:opacity-80',
                    collapsed ? 'justify-center px-0' : 'gap-3'
                  )}
                  style={{
                    backgroundColor: isActive ? (isDark ? 'rgba(240,169,78,0.08)' : 'rgba(240,169,78,0.05)') : 'transparent',
                    color: isActive ? colors.accent.amber : colors.textMuted,
                  }}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                  {isActive && (
                    <span 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full"
                      style={{ backgroundColor: colors.accent.amber }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div 
          className="border-t p-4 flex-shrink-0"
          style={{ borderColor: colors.border }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="flex-shrink-0 w-9 h-9 rounded-md border flex items-center justify-center"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <User className="h-4 w-4" style={{ color: colors.accent.amber }} />
            </div>
            {!collapsed && user && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{user.name}</p>
                <p className="text-[10px] font-mono truncate" style={{ color: colors.textMuted }}>{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="p-1.5 rounded-md transition-colors hover:opacity-80"
                style={{ color: colors.textMuted }}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
          {!collapsed && (
            <Link 
              to="/profile" 
              className="mt-2 block text-[10px] font-mono transition-colors hover:opacity-80"
              style={{ color: colors.accent.amber }}
            >
              Profile Settings →
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
