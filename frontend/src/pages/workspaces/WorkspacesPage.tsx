import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Folder, 
  Check, 
  X, 
  Users, 
  Briefcase,
  Calendar,
  AlertTriangle,
  Settings,
  Layers,
  Zap,
  Sparkles,
  Grid,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const WorkspacesPage: React.FC = () => {
  const { workspaces, activeWorkspace, createWorkspace, updateWorkspace, deleteWorkspace, setActiveWorkspace } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const handleCreate = async () => {
    if (newName.trim()) {
      await createWorkspace(newName.trim(), newDescription.trim() || undefined);
      setNewName('');
      setNewDescription('');
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (editName.trim()) {
      await updateWorkspace(id, { name: editName.trim(), description: editDescription.trim() || undefined });
      setEditingId(null);
    }
  };

  const startEdit = (workspace: any) => {
    setEditingId(workspace.id);
    setEditName(workspace.name);
    setEditDescription(workspace.description || '');
  };

  const handleDelete = async (id: number) => {
    await deleteWorkspace(id);
    setDeleteConfirmId(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

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
      className="min-h-screen p-4 flex flex-col relative transition-colors duration-300"
      style={{ 
        backgroundColor: colors.bg,
        ...gridBgStyle 
      }}
    >
      <div className="flex flex-col max-w-7xl mx-auto w-full relative z-10 gap-4 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border p-6 transition-colors duration-300 ${
            isDark 
              ? 'bg-[#12181F] border-[#232B35]' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-md border ${
                isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
              }`}>
                <Layers className="h-5 w-5" style={{ color: colors.accent.amber }} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className={`text-2xl font-bold tracking-tight ${
                    isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'
                  }`}>
                    Workspaces
                  </h1>
                  <Badge variant="info" size="sm">{workspaces.length}</Badge>
                </div>
                <p className={`text-sm font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                  Organize your datasets, analyses, reports, and projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className={`flex items-center gap-1 p-1 rounded-md border ${
                isDark ? 'border-[#232B35] bg-[#0B0F14]' : 'border-gray-200 bg-gray-50'
              }`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'grid'
                      ? isDark ? 'bg-[#12181F] text-[#EDF1F5]' : 'bg-white text-[#0F172A] shadow-sm'
                      : isDark ? 'text-[#4A5563] hover:text-[#8B96A5]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === 'list'
                      ? isDark ? 'bg-[#12181F] text-[#EDF1F5]' : 'bg-white text-[#0F172A] shadow-sm'
                      : isDark ? 'text-[#4A5563] hover:text-[#8B96A5]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => setIsCreating(true)}
                className="font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Workspace
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        {workspaces.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              { 
                label: 'Total Workspaces', 
                value: workspaces.length, 
                icon: <Folder className="h-4 w-4" />,
                color: colors.accent.amber
              },
              { 
                label: 'Active Workspace', 
                value: activeWorkspace ? activeWorkspace.name : 'None', 
                icon: <Check className="h-4 w-4" />,
                color: colors.accent.teal
              },
              { 
                label: 'Projects', 
                value: workspaces.length > 0 ? workspaces.length : '0', 
                icon: <Briefcase className="h-4 w-4" />,
                color: colors.accent.azure
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 transition-colors duration-300 ${
                  isDark 
                    ? 'bg-[#12181F] border-[#232B35]' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md border ${
                    isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div style={{ color: stat.color }}>{stat.icon}</div>
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xl font-bold truncate ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Create Workspace Form */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-lg border p-6 transition-colors duration-300 ${
                isDark 
                  ? 'bg-[#12181F] border-[#232B35]' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-md border ${
                  isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Plus className="h-4 w-4" style={{ color: colors.accent.amber }} />
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                    Create Workspace
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                    Enter the details for your new workspace
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                  }`}>
                    Workspace Name <span style={{ color: colors.accent.coral }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Marketing Analytics, Product Research"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={`w-full rounded-md border px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none font-mono ${
                      isDark 
                        ? 'bg-[#0B0F14] border-[#232B35] text-[#EDF1F5] placeholder:text-[#4A5563] focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20' 
                        : 'bg-gray-50 border-gray-200 text-[#0F172A] placeholder:text-gray-400 focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20'
                    }`}
                    autoFocus
                  />
                </div>
                <div>
                  <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                  }`}>
                    Description <span className={isDark ? 'text-[#4A5563]' : 'text-gray-400'}>optional</span>
                  </label>
                  <input
                    type="text"
                    placeholder="What's this workspace for?"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className={`w-full rounded-md border px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none font-mono ${
                      isDark 
                        ? 'bg-[#0B0F14] border-[#232B35] text-[#EDF1F5] placeholder:text-[#4A5563] focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20' 
                        : 'bg-gray-50 border-gray-200 text-[#0F172A] placeholder:text-gray-400 focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20'
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button 
                    variant="primary" 
                    onClick={handleCreate} 
                    disabled={!newName.trim()}
                    className="font-medium"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Create Workspace
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => { 
                      setIsCreating(false); 
                      setNewName(''); 
                      setNewDescription(''); 
                    }}
                    className="font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Grid/List */}
        {workspaces.length === 0 && !isCreating ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg border p-12 text-center transition-colors duration-300 ${
              isDark 
                ? 'bg-[#12181F] border-[#232B35]' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex justify-center mb-4">
              <div className={`w-20 h-20 rounded-md flex items-center justify-center border ${
                isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
              }`}>
                <Folder className="h-10 w-10" style={{ color: colors.textDim }} />
              </div>
            </div>
            <h3 className={`text-xl font-bold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
              No workspaces yet
            </h3>
            <p className={`mt-1.5 text-sm font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
              Create your first workspace to organize your datasets and analyses
            </p>
            <div className="mt-6">
              <Button variant="primary" size="lg" onClick={() => setIsCreating(true)} className="font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          )}>
            {workspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                  isDark 
                    ? 'bg-[#12181F] border-[#232B35]' 
                    : 'bg-white border-gray-200'
                } ${
                  activeWorkspace?.id === workspace.id
                    ? isDark 
                      ? 'ring-2 ring-[#F0A94E]/30' 
                      : 'ring-2 ring-[#F0A94E]/20'
                    : 'hover:border-[#3A4453]'
                }`}
              >
                {editingId === workspace.id ? (
                  // Edit Mode
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-md border ${
                        isDark ? 'bg-[#0B0F14] border-[#232B35]' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <Edit className="h-4 w-4" style={{ color: colors.accent.amber }} />
                      </div>
                      <div>
                        <h3 className={`text-base font-semibold ${isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'}`}>
                          Edit Workspace
                        </h3>
                        <p className={`text-xs font-mono ${isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'}`}>
                          Update workspace details
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                          isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                        }`}>
                          Workspace Name <span style={{ color: colors.accent.coral }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className={`w-full rounded-md border px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none font-mono ${
                            isDark 
                              ? 'bg-[#0B0F14] border-[#232B35] text-[#EDF1F5] placeholder:text-[#4A5563] focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20' 
                              : 'bg-gray-50 border-gray-200 text-[#0F172A] placeholder:text-gray-400 focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20'
                          }`}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-mono uppercase tracking-wider mb-1.5 ${
                          isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                        }`}>
                          Description <span className={isDark ? 'text-[#4A5563]' : 'text-gray-400'}>optional</span>
                        </label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="What's this workspace for?"
                          className={`w-full rounded-md border px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none font-mono ${
                            isDark 
                              ? 'bg-[#0B0F14] border-[#232B35] text-[#EDF1F5] placeholder:text-[#4A5563] focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20' 
                              : 'bg-gray-50 border-gray-200 text-[#0F172A] placeholder:text-gray-400 focus:border-[#F0A94E] focus:ring-2 focus:ring-[#F0A94E]/20'
                          }`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-3 pt-1">
                        <Button 
                          variant="primary" 
                          onClick={() => handleUpdate(workspace.id)} 
                          disabled={!editName.trim()}
                          className="font-medium"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setEditingId(null)}
                          className="font-medium"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`p-2.5 rounded-md border flex-shrink-0 ${
                          activeWorkspace?.id === workspace.id
                            ? isDark 
                              ? 'bg-[#F0A94E]/10 border-[#F0A94E]/30' 
                              : 'bg-amber-50 border-amber-200'
                            : isDark 
                              ? 'bg-[#0B0F14] border-[#232B35]' 
                              : 'bg-gray-50 border-gray-200'
                        }`}>
                          <Folder className={`h-5 w-5 ${
                            activeWorkspace?.id === workspace.id
                              ? isDark ? 'text-[#F0A94E]' : 'text-amber-600'
                              : isDark ? 'text-[#4A5563]' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-base font-semibold truncate ${
                              isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]'
                            }`}>
                              {workspace.name}
                            </h3>
                            {activeWorkspace?.id === workspace.id && (
                              <Badge variant="success" size="sm" className="flex-shrink-0">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          {workspace.description && (
                            <p className={`text-sm font-mono mt-0.5 line-clamp-2 ${
                              isDark ? 'text-[#8B96A5]' : 'text-[#64748B]'
                            }`}>
                              {workspace.description}
                            </p>
                          )}
                          <div className={`flex items-center gap-3 mt-2 text-xs font-mono ${
                            isDark ? 'text-[#4A5563]' : 'text-gray-400'
                          }`}>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(workspace.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-2 mt-4 pt-4 border-t ${
                      isDark ? 'border-[#232B35]' : 'border-gray-200'
                    }`}>
                      {activeWorkspace?.id !== workspace.id && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => setActiveWorkspace(workspace)}
                          className="font-medium"
                        >
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          Set Active
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => startEdit(workspace)}
                        className="font-medium"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                      {deleteConfirmId === workspace.id ? (
                        <div className="flex items-center gap-2 ml-auto">
                          <span className={`text-xs font-mono ${isDark ? 'text-[#F2555A]' : 'text-red-600'}`}>
                            Delete?
                          </span>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleDelete(workspace.id)}
                            className="font-medium"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            Confirm
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={cancelDelete}
                            className="font-medium"
                          >
                            <X className="h-3.5 w-3.5 mr-1.5" />
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setDeleteConfirmId(workspace.id)}
                          className="ml-auto font-medium hover:bg-[#F2555A]/10"
                          style={{ 
                            color: colors.accent.coral,
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-2 mt-2"
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
  );
};

export default WorkspacesPage;