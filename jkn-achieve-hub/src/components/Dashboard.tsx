import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import Footer from './Footer';
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
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header Component */}
          <Header />
          
        

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Conditionally render Student or Faculty Dashboard */}
                  {isStudent ? (
              <StudentDashboard />
            ) : (
              <FacultyDashboard />
            )}
          </main>
          
          {/* Footer Component */}
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
