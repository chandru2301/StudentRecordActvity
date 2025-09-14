import React from 'react';
import ActivityManagement from '@/components/ActivityManagement';
import { useAuth } from '@/contexts/AuthContext';

const AdminActivities: React.FC = () => {
  const { user } = useAuth();

  // Check if user is admin/faculty
  const isAdmin = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view all activities.</p>
        </div>
      </div>
    );
  }

  return (
    <ActivityManagement 
      showAll={true}
    />
  );
};

export default AdminActivities;
