import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, FileText, BarChart3, Brain } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Upload' },
    { to: '/analysis', icon: BarChart3, label: 'Analysis' },
    { to: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">AI Data Intelligence</span>
        </div>
        
        <nav className="space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg transition-colors duration-200 hover:bg-primary-50 hover:text-primary-700 ${
                location.pathname === to ? 'bg-primary-50 text-primary-700 font-medium' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="px-4 py-2 bg-primary-50 rounded-lg">
            <p className="text-xs text-gray-600">Pipeline Status</p>
            <p className="text-sm font-medium text-primary-700">✓ Ready</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
