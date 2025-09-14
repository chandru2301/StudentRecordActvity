import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Upload, Bell, FileText, TrendingUp, Calendar, Award } from "lucide-react";

const StudentOverview = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-heading font-bold">Student Dashboard</h1>
      <p className="text-muted-foreground">Track your achievements and manage your academic profile</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">+3 this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documents Verified</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">6 pending review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">+2 this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">92%</div>
          <p className="text-xs text-muted-foreground">Above average</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest academic and extracurricular activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Science Fair Participation</p>
              <p className="text-xs text-muted-foreground">Submitted 2 days ago • Pending verification</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Research Paper Published</p>
              <p className="text-xs text-muted-foreground">Verified 1 week ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sports Competition</p>
              <p className="text-xs text-muted-foreground">Under review • 2 weeks ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>Important dates and events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Semester Project Submission</p>
                <p className="text-xs text-muted-foreground">Due in 5 days</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Remind</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Workshop Registration</p>
                <p className="text-xs text-muted-foreground">Closes in 3 days</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Register</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const StudentActivities = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Activity Tracker</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Student Activity Tracker content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const StudentDocuments = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Document Upload & Verification</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Document Upload & Verification content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const StudentAlerts = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Event & Deadline Alerts</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Event & Deadline Alerts content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const StudentReports = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Comprehensive Reports</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Comprehensive Reports content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const StudentDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="student" />
        <SidebarInset className="flex-1">
          <header className="h-16 border-b border-border flex items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Student Achievement Platform</h2>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<StudentOverview />} />
              <Route path="/activities" element={<StudentActivities />} />
              <Route path="/documents" element={<StudentDocuments />} />
              <Route path="/alerts" element={<StudentAlerts />} />
              <Route path="/reports" element={<StudentReports />} />
              <Route path="*" element={<Navigate to="/student" replace />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;