import React from 'react';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Users,
  Calendar,
  Clock,
  CheckCircle
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

const StudentDashboard: React.FC = () => {
  const { 
    summaryCards, 
    examResultsChart, 
    gradeDistributionChart, 
    upcomingExams, 
    notifications 
  } = studentDashboardData;

  const examTableColumns = ['Subject', 'Date', 'Time', 'Status'];
  const examTableData = upcomingExams.map(exam => ({
    subject: exam.subject,
    date: new Date(exam.date).toLocaleDateString(),
    time: exam.time,
    status: exam.status
  }));

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
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                  title="Courses Enrolled"
                  value={summaryCards.coursesEnrolled}
                  icon={<BookOpen className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                />
                <SummaryCard
                  title="Credits Completed"
                  value={summaryCards.creditsCompleted}
                  icon={<Award className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-green-500 to-green-600"
                />
                <SummaryCard
                  title="GPA"
                  value={summaryCards.gpa}
                  icon={<TrendingUp className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                  subtitle="Out of 4.0"
                />
                <SummaryCard
                  title="Attendance %"
                  value={`${summaryCards.attendancePercentage}%`}
                  icon={<Users className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-orange-500 to-orange-600"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Exam Results Bar Chart */}
                <BarChartCard
                  title={examResultsChart.title}
                  subtitle={examResultsChart.subtitle}
                  data={examResultsChart.data}
                  dataKey="marks"
                  xAxisKey="subject"
                  color="#3B82F6"
                />

                {/* Grade Distribution Pie Chart */}
                <PieChartCard
                  title={gradeDistributionChart.title}
                  subtitle={gradeDistributionChart.subtitle}
                  data={gradeDistributionChart.data}
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
                  notifications={notifications}
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
