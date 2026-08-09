import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Plus, Edit, Trash2, Folder, Check, X } from 'lucide-react';

const WorkspacesPage: React.FC = () => {
  const { workspaces, activeWorkspace, createWorkspace, updateWorkspace, deleteWorkspace, setActiveWorkspace } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workspaces</h1>
        <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setIsCreating(true)}>
          New Workspace
        </Button>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4 border border-primary-200 dark:border-primary-800">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Create Workspace</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Workspace name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
            />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate}>Create</Button>
              <Button variant="secondary" size="sm" onClick={() => { setIsCreating(false); setNewName(''); setNewDescription(''); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {workspaces.length === 0 && !isCreating && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Folder className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium">No workspaces yet</p>
            <p className="text-sm">Create your first workspace to organize your projects</p>
          </div>
        )}

        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border-2 transition-all ${
              activeWorkspace?.id === workspace.id
                ? 'border-primary-500 dark:border-primary-400'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            {editingId === workspace.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleUpdate(workspace.id)}>Save</Button>
                  <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Folder className="h-8 w-8 text-primary-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">{workspace.name}</h3>
                      {activeWorkspace?.id === workspace.id && (
                        <Badge variant="success" size="sm">Active</Badge>
                      )}
                    </div>
                    {workspace.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">{workspace.description}</p>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Created {new Date(workspace.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeWorkspace?.id !== workspace.id && (
                    <Button variant="secondary" size="sm" onClick={() => setActiveWorkspace(workspace)}>
                      <Check className="h-4 w-4 mr-1" /> Select
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => startEdit(workspace)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteWorkspace(workspace.id)}>
                    <Trash2 className="h-4 w-4 text-danger-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkspacesPage;
