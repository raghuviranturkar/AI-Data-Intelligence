import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  Loader2, 
  User, 
  Mail, 
  LogOut, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Clock,
  UserCircle,
  Settings,
  Fingerprint,
  Monitor,
  Zap,
  Lock,
} from 'lucide-react';
import api from '../services/api';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Check dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Color tokens
  const colors = {
    bg: isDark ? '#0B0F14' : '#F1F4F8',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    border: isDark ? '#232B35' : '#E2E8F0',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      coral: '#F2555A',
      azure: '#4EA1F0',
      purple: '#B48CF2',
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch('/auth/profile', { name, email });
      setSuccess('Profile updated successfully');
      const resp = await api.get('/auth/me');
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin" 
              style={{ borderTopColor: colors.accent.amber }} 
            />
          </div>
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const gridBgStyle = isDark 
    ? {
        backgroundImage: 'linear-gradient(to right, rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,241,245,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }
    : {
        backgroundImage: 'linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      };

  return (
    <div 
      className="h-screen flex flex-col relative transition-colors duration-300 overflow-hidden"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 h-full p-4 gap-4">
        {/* Header - Fixed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border p-5 flex-shrink-0 transition-colors duration-300 ${
            isDark 
              ? 'bg-[#12181F] border-[#232B35]' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-md border ${
                isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
              }`}>
                <Settings className="h-5 w-5" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className={`text-2xl font-bold tracking-tight ${
                    isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'
                  }`}>
                    Account Settings
                  </h1>
                  <Badge variant="info" size="sm">v2.0</Badge>
                </div>
                <p className={`text-sm font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                  Manage your profile information and account preferences
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                STATUS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-xs font-mono ${isDark ? 'text-[#3ECF8E]' : 'text-emerald-600'}`}>
                Online
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Fixed height with scroll */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Sidebar - Static, no scroll */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 h-full"
          >
            <div className={`rounded-lg border p-6 h-full transition-colors duration-300 relative ${
              isDark 
                ? 'bg-[#12181F] border-[#232B35]' 
                : 'bg-white border-gray-200'
            }`}>
              {/* Corner brackets */}
              <span className="absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none" 
                style={{ borderColor: isDark ? '#232B35' : '#E2E8F0' }} />
              <span className="absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none" 
                style={{ borderColor: isDark ? '#232B35' : '#E2E8F0' }} />
              <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none" 
                style={{ borderColor: isDark ? '#232B35' : '#E2E8F0' }} />
              <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none" 
                style={{ borderColor: isDark ? '#232B35' : '#E2E8F0' }} />

              <div className="flex flex-col items-center text-center h-full">
                <div className={`w-24 h-24 rounded-md flex items-center justify-center border mb-4 flex-shrink-0 ${
                  isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                }`}>
                  <UserCircle className="h-14 w-14" style={{ color: colors.accent.amber }} />
                </div>
                
                <h3 className={`text-lg font-bold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                  {user.name || 'User'}
                </h3>
                <p className={`text-sm font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                  {user.email}
                </p>
                
                <div className="w-full mt-4 pt-4 border-t flex-1" style={{ borderColor: colors.border }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3 rounded-md border ${
                      isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                        STATUS
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className={`text-sm font-medium ${isDark ? 'text-[#3ECF8E]' : 'text-emerald-600'}`}>
                          Active
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-md border ${
                      isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                        MEMBER
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3.5 w-3.5" style={{ color: colors.textMuted }} />
                        <span className={`text-sm font-medium ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                          2024
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-3 p-3 rounded-md border flex-shrink-0" style={{ borderColor: colors.border }}>
                  <div className={`flex items-center justify-between text-xs font-mono ${
                    isDark ? 'text-[#4A5563]' : 'text-gray-400'
                  }`}>
                    <span>SESSION</span>
                    <span className={isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}>Active</span>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 text-xs font-mono ${
                    isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                  }`}>
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Chrome · Windows</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Scrollable */}
          <div className="lg:col-span-2 h-full overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-4 pb-2">
              {/* Profile Information */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-lg border p-6 transition-colors duration-300 ${
                  isDark 
                    ? 'bg-[#12181F] border-[#232B35]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md border ${
                      isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <User className="h-4 w-4" style={{ color: colors.accent.amber }} />
                    </div>
                    <div>
                      <h2 className={`text-base font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                        Personal Information
                      </h2>
                      <p className={`text-xs font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                        Update your account details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5" style={{ color: colors.textMuted }} />
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                      isDark ? 'text-[#4A5563]' : 'text-gray-400'
                    }`}>
                      Encrypted
                    </span>
                  </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                      isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                    }`}>
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-4 w-4" style={{ color: colors.textMuted }} />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full rounded-md border pl-9 pr-3 py-2.5 text-sm transition-all duration-200 focus:outline-none font-mono ${
                          isDark 
                            ? 'bg-[#0B0F14] border-[#232B35] text-[#EDF1F5] placeholder:text-[#4A5563] focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20' 
                            : 'bg-gray-50 border-gray-200 text-[#0F172A] placeholder:text-gray-400 focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                      isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                    }`}>
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-4 w-4" style={{ color: colors.textMuted }} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-md border pl-9 pr-3 py-2.5 text-sm transition-all duration-200 focus:outline-none font-mono ${
                          isDark 
                            ? 'bg-[#0B0F14] border-[#232B35] text-[#EDF1F5] placeholder:text-[#4A5563] focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20' 
                            : 'bg-gray-50 border-gray-200 text-[#0F172A] placeholder:text-gray-400 focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20'
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Success/Error Messages */}
                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-md border ${
                          isDark 
                            ? 'bg-[#3ECF8E]/10 border-[#3ECF8E]/30' 
                            : 'bg-emerald-50 border-emerald-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: colors.accent.teal }} />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-[#3ECF8E]' : 'text-emerald-700'}`}>
                              {success}
                            </p>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-[#3ECF8E]/70' : 'text-emerald-600/80'}`}>
                              Your changes have been saved successfully
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-md border ${
                          isDark 
                            ? 'bg-[#F2555A]/10 border-[#F2555A]/30' 
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-4 w-4 mt-0.5" style={{ color: colors.accent.coral }} />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-[#F2555A]' : 'text-red-700'}`}>
                              Update failed
                            </p>
                            <p className={`text-xs mt-0.5 ${isDark ? 'text-[#F2555A]/70' : 'text-red-600/80'}`}>
                              {error}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="w-full sm:w-auto min-w-[180px] h-11 text-sm font-medium rounded-md"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setName(user.name || '');
                        setEmail(user.email || '');
                        setSuccess('');
                        setError('');
                      }}
                      className={`text-sm font-mono px-4 py-2 rounded-md transition-colors ${
                        isDark 
                          ? 'text-[#8B96A5] hover:text-[#EDF1F5] hover:bg-[#0B0F14]' 
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-gray-50'
                      }`}
                    >
                      Reset Changes
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Account Security */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-lg border p-6 transition-colors duration-300 ${
                  isDark 
                    ? 'bg-[#12181F] border-[#232B35]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-md border ${
                    isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <Shield className="h-4 w-4" style={{ color: colors.accent.coral }} />
                  </div>
                  <div>
                    <h2 className={`text-base font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                      Account Security
                    </h2>
                    <p className={`text-xs font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                      Manage your session and account access
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-md border ${
                  isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-md border ${
                        isDark ? 'bg-[#12181F] border-[#232B35]' : 'bg-white border-gray-200'
                      }`}>
                        <Fingerprint className="h-4 w-4" style={{ color: colors.accent.amber }} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                          {user.email}
                        </p>
                        <p className={`text-xs font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                          Signed in to your account
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      onClick={logout}
                      className="w-full sm:w-auto min-w-[140px] h-11 text-sm font-medium rounded-md"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                  
                  <div className={`mt-4 pt-4 border-t flex flex-wrap items-center gap-4 ${
                    isDark ? 'border-[#232B35]' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className={`text-xs font-mono ${isDark ? 'text-[#3ECF8E]' : 'text-emerald-600'}`}>
                        Active session
                      </span>
                    </div>
                    <span className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                      Last login: Today
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                      IP: 192.168.1.1
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2"
              >
                <span className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                  © 2026 AI Data Intelligence Platform
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                    Version 2.0
                  </span>
                  <span className={`w-px h-3 ${isDark ? 'bg-[#232B35]' : 'bg-gray-200'}`} />
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className={`text-xs font-mono ${isDark ? 'text-[#3ECF8E]' : 'text-emerald-600'}`}>
                      All systems operational
                    </span>
                  </div>
                  <span className={`w-px h-3 ${isDark ? 'bg-[#232B35]' : 'bg-gray-200'}`} />
                  <span className={`text-xs font-mono ${isDark ? 'text-[#4A5563]' : 'text-gray-400'}`}>
                    <span className={isDark ? 'text-[#F0A94E]' : 'text-amber-600'}>●</span> Secure
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#232B35' : '#E2E8F0'};
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#3A4453' : '#CBD5E1'};
        }
      `}</style>
    </div>
  );
};

export default Profile;