import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Activity,
  FileText,
  Eye,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import { AppSidebar } from '../AppSidebar';
import Header from '../Header';
import Footer from '../Footer';
import { studentDashboardData } from '../../data/dashboardData';
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

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profileInfo, hasPermission } = useRole();
  
  const [dashboardData, setDashboardData] = useState(studentDashboardData);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    creditsCompleted: 0,
    gpa: 0,
    attendancePercentage: 0,
    totalActivities: 0,
    completedActivities: 0,
    pendingCertificates: 0,
    approvedCertificates: 0,
  });

  const examTableColumns = ['Subject', 'Date', 'Time', 'Status'];
  const examTableData = dashboardData.upcomingExams.map(exam => ({
    subject: exam.subject,
    date: new Date(exam.date).toLocaleDateString(),
    time: exam.time,
    status: exam.status
  }));

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        
        // Simulate API calls for student-specific data
        const mockStudentData = {
          coursesEnrolled: 6,
          creditsCompleted: 18,
          gpa: 3.7,
          attendancePercentage: 85,
          totalActivities: 12,
          completedActivities: 8,
          pendingCertificates: 2,
          approvedCertificates: 5,
        };

        setStats(mockStudentData);
        
        // Update dashboard data with real student info
        setDashboardData(prev => ({
          ...prev,
          summaryCards: {
            ...prev.summaryCards,
            coursesEnrolled: mockStudentData.coursesEnrolled,
            creditsCompleted: mockStudentData.creditsCompleted,
            gpa: mockStudentData.gpa,
            attendancePercentage: mockStudentData.attendancePercentage,
          }
        }));

      } catch (error) {
        console.error('Failed to load student dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudentData();
  }, [user, toast]);

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      'View Activities': '/student/activities',
      'Upload Certificate': '/certificates',
      'View Attendance': '/attendance',
      'Take Assessment': '/assessments',
      'View Profile': '/student/profile',
      'View Reports': '/analytics',
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
                  Welcome back, {profileInfo.name || 'Student'}!
                </h1>
                <p className="text-muted-foreground">
                  Track your academic progress and manage your activities
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
                      title="Courses Enrolled"
                      value={stats.coursesEnrolled}
                      icon={<BookOpen className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                    <SummaryCard
                      title="Credits Completed"
                      value={stats.creditsCompleted}
                      icon={<Award className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-green-500 to-green-600"
                    />
                    <SummaryCard
                      title="GPA"
                      value={stats.gpa}
                      icon={<TrendingUp className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-purple-500 to-purple-600"
                      subtitle="Out of 4.0"
                    />
                    <SummaryCard
                      title="Attendance %"
                      value={`${stats.attendancePercentage}%`}
                      icon={<Users className="h-6 w-6 text-white" />}
                      color="bg-gradient-to-r from-orange-500 to-orange-600"
                    />
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Quick Actions
                      </h3>
                      <div className="space-y-3">
                        {[
                          'View Activities',
                          'Upload Certificate', 
                          'View Attendance',
                          'Take Assessment'
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
                        <Award className="h-5 w-5 text-green-600" />
                        Certificates
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Approved</span>
                          <span className="font-semibold text-green-600">{stats.approvedCertificates}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Pending</span>
                          <span className="font-semibold text-yellow-600">{stats.pendingCertificates}</span>
                        </div>
                        <button
                          onClick={() => handleQuickAction('Upload Certificate')}
                          className="w-full mt-4 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                          Upload New Certificate
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        Progress
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Activities Completed</span>
                          <span className="font-semibold">{stats.completedActivities}/{stats.totalActivities}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.completedActivities / stats.totalActivities) * 100}%` }}
                          ></div>
                        </div>
                        <button
                          onClick={() => handleQuickAction('View Activities')}
                          className="w-full mt-4 p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-sm font-medium"
                        >
                          View All Activities
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Exam Results Bar Chart */}
                <BarChartCard
                  title={dashboardData.examResultsChart.title}
                  subtitle={dashboardData.examResultsChart.subtitle}
                  data={dashboardData.examResultsChart.data}
                  dataKey="marks"
                  xAxisKey="subject"
                  color="#3B82F6"
                />

                {/* Grade Distribution Pie Chart */}
                <PieChartCard
                  title={dashboardData.gradeDistributionChart.title}
                  subtitle={dashboardData.gradeDistributionChart.subtitle}
                  data={dashboardData.gradeDistributionChart.data}
                  dataKey="count"
                  nameKey="grade"
                />
              </div>

              {/* Tables and Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upcoming Exams Table */}
                <DataTable
                  title="Upcoming Exams"
                  subtitle="Your scheduled examinations"
                  columns={examTableColumns}
                  data={examTableData}
                  renderCell={(value, column, row) => {
                    if (column.toLowerCase().includes('status')) {
                      return (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-700 font-medium">{value}</span>
                        </div>
                      );
                    }
                    if (column.toLowerCase().includes('date')) {
                      return (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-gray-700">{value}</span>
                        </div>
                      );
                    }
                    if (column.toLowerCase().includes('time')) {
                      return (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span className="text-gray-700">{value}</span>
                        </div>
                      );
                    }
                    return <span className="text-gray-700">{value}</span>;
                  }}
                />

                {/* Notifications */}
                <NotificationList
                  title="Notifications & Announcements"
                  subtitle="Latest updates and important information"
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

export default StudentDashboard;
