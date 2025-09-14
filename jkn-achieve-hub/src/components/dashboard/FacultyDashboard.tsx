import React from 'react';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  FileText,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock
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

const FacultyDashboard: React.FC = () => {
  const { 
    summaryCards, 
    studentPerformanceChart, 
    attendanceDistributionChart, 
    studentPerformance, 
    validationRequests,
    notifications 
  } = facultyDashboardData;

  const performanceTableColumns = ['Student Name', 'Subject', 'Marks', 'Status'];
  const performanceTableData = studentPerformance.map(student => ({
    studentname: student.studentName,
    subject: student.subject,
    marks: student.marks,
    status: student.status
  }));

  const validationTableColumns = ['Student Name', 'Subject', 'Request Type', 'Status'];
  const validationTableData = validationRequests.map(request => ({
    studentname: request.studentName,
    subject: request.subject,
    requesttype: request.requestType,
    status: request.status
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
                  title="Students Assigned"
                  value={summaryCards.studentsAssigned}
                  icon={<Users className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                />
                <SummaryCard
                  title="Courses Teaching"
                  value={summaryCards.coursesTeaching}
                  icon={<BookOpen className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-green-500 to-green-600"
                />
                <SummaryCard
                  title="Attendance Rate"
                  value={`${summaryCards.attendanceRate}%`}
                  icon={<TrendingUp className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                />
                <SummaryCard
                  title="Reports Generated"
                  value={summaryCards.reportsGenerated}
                  icon={<FileText className="h-6 w-6 text-white" />}
                  color="bg-gradient-to-r from-orange-500 to-orange-600"
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Student Performance Bar Chart */}
                <BarChartCard
                  title={studentPerformanceChart.title}
                  subtitle={studentPerformanceChart.subtitle}
                  data={studentPerformanceChart.data}
                  dataKey="averageMarks"
                  xAxisKey="class"
                  color="#10B981"
                />

                {/* Attendance Distribution Pie Chart */}
                <PieChartCard
                  title={attendanceDistributionChart.title}
                  subtitle={attendanceDistributionChart.subtitle}
                  data={attendanceDistributionChart.data}
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

export default FacultyDashboard;
