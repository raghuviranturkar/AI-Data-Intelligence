import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Define Workspace type directly here to avoid import issues
interface Workspace {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  created_at: string;
  updated_at?: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  loadWorkspaces: () => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  updateWorkspace: (id: number, data: { name?: string; description?: string }) => Promise<Workspace>;
  deleteWorkspace: (id: number) => Promise<void>;
  setActiveWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/workspaces/');
      setWorkspaces(response.data);
      const savedId = localStorage.getItem('activeWorkspaceId');
      if (savedId) {
        const found = response.data.find((w: Workspace) => w.id === parseInt(savedId));
        if (found) setActiveWorkspace(found);
        else if (response.data.length > 0) setActiveWorkspace(response.data[0]);
      } else if (response.data.length > 0) {
        setActiveWorkspace(response.data[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkspace = async (name: string, description?: string): Promise<Workspace> => {
    const response = await api.post('/workspaces/', { name, description });
    const newWorkspace = response.data;
    setWorkspaces(prev => [...prev, newWorkspace]);
    if (!activeWorkspace) {
      setActiveWorkspace(newWorkspace);
      localStorage.setItem('activeWorkspaceId', String(newWorkspace.id));
    }
    return newWorkspace;
  };

  const updateWorkspace = async (id: number, data: { name?: string; description?: string }) => {
    const response = await api.patch(`/workspaces/${id}`, data);
    const updated = response.data;
    setWorkspaces(prev => prev.map(w => w.id === id ? updated : w));
    if (activeWorkspace?.id === id) {
      setActiveWorkspace(updated);
    }
    return updated;
  };

  const deleteWorkspace = async (id: number) => {
    await api.delete(`/workspaces/${id}`);
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    if (activeWorkspace?.id === id) {
      const remaining = workspaces.filter(w => w.id !== id);
      if (remaining.length > 0) {
        setActiveWorkspace(remaining[0]);
        localStorage.setItem('activeWorkspaceId', String(remaining[0].id));
      } else {
        setActiveWorkspace(null);
        localStorage.removeItem('activeWorkspaceId');
      }
    }
  };

  const setActiveWorkspaceAndPersist = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    localStorage.setItem('activeWorkspaceId', String(workspace.id));
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const value = {
    workspaces,
    activeWorkspace,
    isLoading,
    error,
    loadWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setActiveWorkspace: setActiveWorkspaceAndPersist,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
};
