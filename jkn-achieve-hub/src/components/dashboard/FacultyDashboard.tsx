import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  FileText,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  Activity,
  Calendar,
  ArrowRight,
  Loader2,
  MessageSquare,
  Eye
} from 'lucide-react';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import { AppSidebar } from '../AppSidebar';
import Header from '../Header';
import Footer from '../Footer';
import { facultyDashboardData } from '../../data/dashboardData';
import { 
  SummaryCard, 
  BarChartCard, 
  PieChartCard, 
  DataTable, 
  NotificationList 
} from './ChartComponents';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../hooks/useRole';
import { useToast } from '../../hooks/use-toast';

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profileInfo, hasPermission } = useRole();
  
  const [dashboardData, setDashboardData] = useState(facultyDashboardData);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    studentsAssigned: 0,
    coursesTeaching: 0,
    attendanceRate: 0,
    reportsGenerated: 0,
    pendingCertificates: 0,
    approvedCertificates: 0,
    totalAssessments: 0,
    completedAssessments: 0,
  });

  const performanceTableColumns = ['Student Name', 'Subject', 'Marks', 'Status'];
  const performanceTableData = dashboardData.studentPerformance.map(student => ({
    studentname: student.studentName,
    subject: student.subject,
    marks: student.marks,
    status: student.status
  }));

  const validationTableColumns = ['Student Name', 'Subject', 'Request Type', 'Status'];
  const validationTableData = dashboardData.validationRequests.map(request => ({
    studentname: request.studentName,
    subject: request.subject,
    requesttype: request.requestType,
    status: request.status
  }));

  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls for faculty-specific data
        const mockFacultyData = {
          studentsAssigned: 45,
          coursesTeaching: 4,
          attendanceRate: 92,
          reportsGenerated: 12,
          pendingCertificates: 15,
          approvedCertificates: 23,
          totalAssessments: 8,
          completedAssessments: 6,
        };

        setStats(mockFacultyData);
        
        // Update dashboard data with real faculty info
        setDashboardData(prev => ({
          ...prev,
          summaryCards: {
            ...prev.summaryCards,
            studentsAssigned: mockFacultyData.studentsAssigned,
            coursesTeaching: mockFacultyData.coursesTeaching,
            attendanceRate: mockFacultyData.attendanceRate,
            reportsGenerated: mockFacultyData.reportsGenerated,
          }
        }));

      } catch (error) {
        console.error('Failed to load faculty dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadFacultyData();
  }, [user, toast]);

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      'Review Certificates': '/certificates',
      'Create Assessment': '/assessments',
      'View Attendance': '/attendance',
      'Manage Activities': '/admin/activities',
      'Generate Reports': '/analytics',
      'View Profile': '/faculty/profile',
      'Manage Events': '/faculty/events',
    };
    
    const route = actionMap[action];
    if (route) {
      navigate(route);
    } else {
      toast({
        title: "Action Not Available",
        description: `The action "${action}" is not yet implemented.`,
        variant: "default"
      });
    }
  };

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
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Welcome back, {profileInfo.name || 'Faculty'}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your students and track their academic progress
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading your dashboard...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SummaryCard
                      title="Students Assigned"
                      value={stats.studentsAssigned}
                      icon={<Users className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                    <SummaryCard
                      title="Courses Teaching"
                      value={stats.coursesTeaching}
                      icon={<BookOpen className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-green-500 to-green-600"
                    />
                    <SummaryCard
                      title="Attendance Rate"
                      value={`${stats.attendanceRate}%`}
                      icon={<TrendingUp className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-purple-500 to-purple-600"
                    />
                    <SummaryCard
                      title="Reports Generated"
                      value={stats.reportsGenerated}
                      icon={<FileText className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-orange-500 to-orange-600"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        {[
                          'Review Certificates',
                          'Create Assessment', 
                          'View Attendance',
                          'Manage Activities'
                        ].map((action) => (
                          <button
                            key={action}
                            onClick={() => handleQuickAction(action)}
                            className="w-full flex items-center justify-between p-3 text-left rounded-lg border hover:bg-muted/50 transition-colors group"
                          >
                            <span className="text-sm font-medium">{action}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        Certificate Reviews
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Pending Review</span>
                          <span className="font-semibold text-yellow-600">{stats.pendingCertificates}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Approved</span>
                          <span className="font-semibold text-green-600">{stats.approvedCertificates}</span>
                        </div>
                        <button
                          onClick={() => handleQuickAction('Review Certificates')}
                          className="w-full mt-4 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                          Review Certificates
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        Assessments
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Total Created</span>
                          <span className="font-semibold">{stats.totalAssessments}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Completed</span>
                          <span className="font-semibold text-green-600">{stats.completedAssessments}</span>
                        </div>
                        <button
                          onClick={() => handleQuickAction('Create Assessment')}
                          className="w-full mt-4 p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm font-medium"
                        >
                          Create New Assessment
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student Performance Bar Chart */}
                <BarChartCard
                  title={dashboardData.studentPerformanceChart.title}
                  subtitle={dashboardData.studentPerformanceChart.subtitle}
                  data={dashboardData.studentPerformanceChart.data}
                  dataKey="averageMarks"
                  xAxisKey="class"
                  color="#10B981"
                />

                {/* Attendance Distribution Pie Chart */}
                <PieChartCard
                  title={dashboardData.attendanceDistributionChart.title}
                  subtitle={dashboardData.attendanceDistributionChart.subtitle}
                  data={dashboardData.attendanceDistributionChart.data}
                  dataKey="count"
                  nameKey="status"
                />
              </div>

              {/* Tables and Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student Performance Table */}
                <DataTable
                  title="Student Performance"
                  subtitle="Recent exam results and grades"
                  columns={performanceTableColumns}
                  data={performanceTableData}
                  renderCell={(value, column, row) => {
                    if (column.toLowerCase().includes('status')) {
                      const isPassed = value.toLowerCase().includes('passed');
                      return (
                        <div className="flex items-center gap-2">
                          {isPassed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className={`font-medium ${isPassed ? 'text-green-700' : 'text-orange-700'}`}>
                            {value}
                          </span>
                        </div>
                      );
                    }
                    if (column.toLowerCase().includes('marks')) {
                      return (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-gray-700">{value}/100</span>
                        </div>
                      );
                    }
                    return <span className="text-gray-700">{value}</span>;
                  }}
                />

                {/* Validation Requests Table */}
                <DataTable
                  title="Validation Requests"
                  subtitle="Pending approvals and reviews"
                  columns={validationTableColumns}
                  data={validationTableData}
                  renderCell={(value, column, row) => {
                    if (column.toLowerCase().includes('status')) {
                      const isApproved = value.toLowerCase().includes('approved');
                      return (
                        <div className="flex items-center gap-2">
                          {isApproved ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-orange-500" />
                          )}
                          <span className={`font-medium ${isApproved ? 'text-green-700' : 'text-orange-700'}`}>
                            {value}
                          </span>
                        </div>
                      );
                    }
                    if (column.toLowerCase().includes('requesttype')) {
                      return (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-500" />
                          <span className="text-gray-700">{value}</span>
                        </div>
                      );
                    }
                    return <span className="text-gray-700">{value}</span>;
                  }}
                />
              </div>

              {/* Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <NotificationList
                  title="Faculty Notifications & Tasks"
                  subtitle="Important updates and upcoming deadlines"
                  notifications={dashboardData.notifications}
                />
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

export default FacultyDashboard;
