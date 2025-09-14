import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SidebarProvider, SidebarInset } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import Footer from './Footer';
import ProfileHeader from './ProfileHeader';
import { FeedbackSection } from './FeedbackCard';
import PerformanceChart from './PerformanceChart';
import { ContactCard, DocumentList } from './DocumentList';
import { studentMockData } from '../data/mockData';
import { 
  MessageCircle, 
  Phone, 
  Edit,
  Filter,
  Calendar,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  
  // Show loading state if user data is not available
  if (!user || !user.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Ensure user is a student
  if (user.role !== 'STUDENT') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to students.</p>
        </div>
      </div>
    );
  }

  const studentProfile = user.profile;
  
  // Transform user data to match ProfileHeader interface
  const profileData = {
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile.name)}&background=8b5cf6&color=ffffff&size=150`,
    name: studentProfile.name,
    classOrDepartment: `${studentProfile.degree?.toUpperCase() || 'STUDENT'} - Roll: ${studentProfile.rollNumber}`,
    location: 'University Campus',
    profileInfo: {
      dateOfBirth: new Date(studentProfile.dob).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      enrollment: new Date(studentProfile.dob).toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      }),
      orderNumber: studentProfile.rollNumber,
      bloodType: 'A+', // Default value - can be added to backend
      allergies: 'No Record', // Default value - can be added to backend
      chronicDisease: 'No Record' // Default value - can be added to backend
    }
  };

  // Use mock data for feedback, performance, parents, and documents
  // In a real app, these would be fetched from API endpoints
  const { feedbacks, performanceData, parents, documents } = studentMockData;

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleMessage = () => {
    console.log('Message clicked');
  };

  const handleCall = () => {
    console.log('Call clicked');
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
  };

  const handleEditParents = () => {
    console.log('Edit parents clicked');
  };

  const handleEditDocuments = () => {
    console.log('Edit documents clicked');
  };

  const handleParentMessage = (contactId: string) => {
    console.log(`Message parent: ${contactId}`);
  };

  const handleParentCall = (contactId: string) => {
    console.log(`Call parent: ${contactId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex">
        {/* Sidebar */}
        <AppSidebar role="student" />
        
        {/* Main Content Area */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header Component */}
          <Header />
          
          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Profile Header */}
            <ProfileHeader
              profileImage={profileData.profileImage}
              name={profileData.name}
              classOrDepartment={profileData.classOrDepartment}
              location={profileData.location}
              profileInfo={profileData.profileInfo}
              isStudent={true}
              onEdit={handleEditProfile}
              onMessage={handleMessage}
              onCall={handleCall}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Feedback Section */}
                <FeedbackSection
                  title="Feedback"
                  feedbacks={feedbacks}
                  filters={{
                    subjects: ['Math', 'English', 'Biology', 'History', 'Art', 'Chemistry'],
                    timePeriods: ['7 Days', '30 Days', 'All']
                  }}
                  onFilterChange={handleFilterChange}
                />

                {/* Performance Chart */}
                <PerformanceChart
                  title="Performance"
                  data={performanceData}
                  timeFilters={['Last 7 Days', 'Last 30 Days', 'All Time']}
                  onFilterChange={(filter) => console.log('Performance filter:', filter)}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Parents/Caretakers Section */}
                <ContactCard
                  title="Parents / Caretakers"
                  contacts={parents}
                  onEdit={handleEditParents}
                  onMessage={handleParentMessage}
                  onCall={handleParentCall}
                />

                {/* Documents Section */}
                <DocumentList
                  title="Documents"
                  documents={documents}
                  onEdit={handleEditDocuments}
                />

                {/* Quick Stats Card */}
                <div className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    Academic Summary
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(performanceData.reduce((sum, item) => sum + item.score, 0) / performanceData.length * 10) / 10}
                      </div>
                      <div className="text-sm text-gray-600">Average Grade</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="text-2xl font-bold text-green-600">
                        {feedbacks.filter(f => f.status === 'completed').length}
                      </div>
                      <div className="text-sm text-gray-600">Completed Tasks</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-2xl font-bold text-purple-600">
                        {feedbacks.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Feedback</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600">
                        {documents.filter(d => d.status === 'available').length}
                      </div>
                      <div className="text-sm text-gray-600">Documents</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          
          {/* Footer Component */}
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentProfile;
