import React from 'react';
import ActivityManagement from '@/components/ActivityManagement';
import { useAuth } from '@/contexts/AuthContext';

const Activities: React.FC = () => {
  const { user } = useAuth();

  return (
    <ActivityManagement 
      studentId={user?.profile?.id}
      showAll={false}
    />
  );
};

export default Activities;
