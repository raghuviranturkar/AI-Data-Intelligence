import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Loader2 } from 'lucide-react';
import api from '../services/api';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.patch('/auth/profile', { name, email });
      setSuccess('Profile updated successfully');
      const resp = await api.get('/auth/me');
      // Update user in context? For simplicity, we'll reload.
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
      <form onSubmit={handleUpdate} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        {success && <div className="text-sm text-success-600 dark:text-success-400">{success}</div>}
        {error && <div className="text-sm text-danger-600 dark:text-danger-400">{error}</div>}
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Update Profile
        </Button>
      </form>
      <div className="mt-6">
        <Button variant="danger" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
};

export default Profile;
