import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import StudentDashboard from './dashboard/StudentDashboard';
import FacultyDashboard from './dashboard/FacultyDashboard';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isStudent = user.role === 'STUDENT';
  const profile = user.profile;
  const userRole = isStudent ? 'student' : 'faculty';

  return (
    <Layout>
      {/* Conditionally render Student or Faculty Dashboard */}
      {isStudent ? (
        <StudentDashboard />
      ) : (
        <FacultyDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;
