import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarProvider, SidebarInset } from './ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import Footer from './Footer';
import ProfileHeader from './ProfileHeader';
import { FeedbackSection } from './FeedbackCard';
import { DocumentList } from './DocumentList';
import { facultyMockData } from '../data/mockData';
import { 
  MessageCircle, 
  Phone, 
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Download,
  BarChart3,
  Filter,
  Eye,
  User,
  GraduationCap,
  Building
} from 'lucide-react';

const FacultyProfile: React.FC = () => {
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

  // Ensure user is faculty
  if (user.role !== 'FACULTY') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to faculty members.</p>
        </div>
      </div>
    );
  }

  const facultyProfile = user.profile;
  
  // Transform user data to match ProfileHeader interface
  const profileData = {
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(facultyProfile.name)}&background=8b5cf6&color=ffffff&size=150`,
    name: facultyProfile.name,
    classOrDepartment: `${facultyProfile.department} Department`,
    location: 'University Campus',
    profileInfo: {
      dateOfJoining: 'Sep/15/2018', // Default value - can be added to backend
      role: 'Professor', // Default value - can be added to backend
      specialization: 'Computer Science', // Default value - can be added to backend
      officeHours: 'Mon-Fri 10:00-12:00', // Default value - can be added to backend
      facultyId: `FAC-${facultyProfile.id.toString().padStart(3, '0')}` // Generate from user ID
    }
  };

  // Use mock data for other sections
  // In a real app, these would be fetched from API endpoints
  const { 
    studentSubmissions, 
    attendanceData, 
    feedbackLogs, 
    documents, 
    schedule 
  } = facultyMockData;

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleMessage = () => {
    console.log('Message clicked');
  };

  const handleCall = () => {
    console.log('Call clicked');
  };

  const handleApproveSubmission = (submissionId: string) => {
    console.log(`Approve submission: ${submissionId}`);
  };

  const handleRejectSubmission = (submissionId: string) => {
    console.log(`Reject submission: ${submissionId}`);
  };

  const handleGenerateReport = () => {
    console.log('Generate report clicked');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex">
        {/* Sidebar */}
        <AppSidebar role="faculty" />
        
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
              isStudent={false}
              onEdit={handleEditProfile}
              onMessage={handleMessage}
              onCall={handleCall}
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Student Activity Validation */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      Student Activity Validation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {studentSubmissions.map(submission => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 ring-2 ring-purple-100">
                            <AvatarImage src={submission.studentImage} alt={submission.studentName} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-sm">
                              {submission.studentName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800">{submission.studentName}</p>
                            <p className="text-sm text-gray-600">{submission.assignment}</p>
                            <p className="text-xs text-gray-500">{submission.subject} • {submission.submissionDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge className={`text-xs ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </Badge>
                          
                          {submission.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="h-7 px-2 bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleApproveSubmission(submission.id)}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 px-2 bg-red-500 hover:bg-red-600 text-white"
                                onClick={() => handleRejectSubmission(submission.id)}
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          )}

                          {submission.grade && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {submission.grade}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Attendance Monitoring */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                        <BarChart3 className="h-4 w-4 text-white" />
                      </div>
                      Attendance Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {attendanceData.map((attendance, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-800">{attendance.subject}</h4>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {Math.round((attendance.present / attendance.total) * 100)}% Attendance
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-green-600">{attendance.present}</div>
                            <div className="text-xs text-gray-600">Present</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-red-600">{attendance.absent}</div>
                            <div className="text-xs text-gray-600">Absent</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-600">{attendance.total}</div>
                            <div className="text-xs text-gray-600">Total</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Feedback & Mentoring Logs */}
                <FeedbackSection
                  title="Feedback & Mentoring Logs"
                  feedbacks={feedbackLogs.map(log => ({
                    id: log.id,
                    teacherName: profileData.name,
                    teacherImage: profileData.profileImage,
                    subject: log.subject,
                    date: log.date,
                    lesson: log.feedback,
                    comment: log.feedback,
                    grade: log.grade,
                    status: log.status
                  }))}
                  filters={{
                    subjects: ['CS-401', 'CS-301', 'CS-302'],
                    timePeriods: ['7 Days', '30 Days', 'All']
                  }}
                  onFilterChange={(filterType, value) => console.log(`Filter changed: ${filterType} = ${value}`)}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Document Review & Approval */}
                <DocumentList
                  title="Document Review & Approval"
                  documents={documents}
                  showActions={true}
                  onApprove={(docId) => console.log(`Approve document: ${docId}`)}
                  onReject={(docId) => console.log(`Reject document: ${docId}`)}
                />

                {/* Schedule & Calendar */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      Schedule & Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {schedule.map(event => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            event.type === 'lecture' ? 'bg-blue-500' :
                            event.type === 'office' ? 'bg-green-500' : 'bg-purple-500'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-800">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.time} • {event.location}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                          {event.date}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Report Generation Tools */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      Report Generation Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        className="h-12 flex flex-col items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
                        onClick={handleGenerateReport}
                      >
                        <Download className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700">PDF Report</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 flex flex-col items-center justify-center gap-1 bg-green-50 hover:bg-green-100 border-green-200"
                        onClick={handleGenerateReport}
                      >
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-700">Excel Export</span>
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-medium text-gray-800 mb-3">Quick Stats</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            {studentSubmissions.length}
                          </div>
                          <div className="text-xs text-gray-600">Submissions</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {studentSubmissions.filter(s => s.status === 'approved').length}
                          </div>
                          <div className="text-xs text-gray-600">Approved</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {attendanceData.reduce((sum, a) => sum + a.present, 0)}
                          </div>
                          <div className="text-xs text-gray-600">Students Present</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">
                            {schedule.length}
                          </div>
                          <div className="text-xs text-gray-600">Scheduled Events</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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

export default FacultyProfile;
