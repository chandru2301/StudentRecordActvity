import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, FileCheck, MessageSquare, BarChart3 } from "lucide-react";

const FacultyOverview = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-heading font-bold">Faculty Dashboard</h1>
      <p className="text-muted-foreground">Manage student validations and institutional analytics</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Validations</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <p className="text-xs text-muted-foreground">Requires your review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students Managed</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">Active this semester</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Documents Reviewed</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89</div>
          <p className="text-xs text-muted-foreground">+12 this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94%</div>
          <p className="text-xs text-muted-foreground">Above department avg</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Validation Requests</CardTitle>
          <CardDescription>Student activities awaiting your approval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Rajesh Kumar - Research Publication</p>
                <p className="text-xs text-muted-foreground">Submitted 2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Review</Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Priya Sharma - Sports Achievement</p>
                <p className="text-xs text-muted-foreground">Submitted 5 hours ago</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Review</Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Amit Singh - Workshop Completion</p>
                <p className="text-xs text-muted-foreground">Validated yesterday</p>
              </div>
            </div>
            <Badge variant="secondary">Approved</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Statistics</CardTitle>
          <CardDescription>Overview of departmental performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Student Engagement</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full">
                <div className="w-16 h-2 bg-primary rounded-full"></div>
              </div>
              <span className="text-sm text-muted-foreground">82%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Activity Submissions</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full">
                <div className="w-18 h-2 bg-secondary rounded-full"></div>
              </div>
              <span className="text-sm text-muted-foreground">91%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Document Quality</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-2 bg-muted rounded-full">
                <div className="w-19 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-muted-foreground">96%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const FacultyValidation = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Student Activity Validation</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Student Activity Validation content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const FacultyFeedback = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Feedback & Mentoring Logs</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Feedback & Mentoring Logs content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const FacultyDocuments = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Document Review & Approval</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Document Review & Approval content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const FacultySchedule = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Faculty Schedule & Calendar</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Faculty Schedule & Calendar content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const FacultyReports = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-heading font-bold">Report Generation Tools</h1>
    <Card>
      <CardContent className="p-6">
        <p className="text-muted-foreground">Report Generation Tools content will be implemented here.</p>
      </CardContent>
    </Card>
  </div>
);

const FacultyDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar role="faculty" />
        <SidebarInset className="flex-1">
          <header className="h-16 border-b border-border flex items-center gap-4 px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Faculty Management Portal</h2>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<FacultyOverview />} />
              <Route path="/validation" element={<FacultyValidation />} />
              <Route path="/feedback" element={<FacultyFeedback />} />
              <Route path="/documents" element={<FacultyDocuments />} />
              <Route path="/schedule" element={<FacultySchedule />} />
              <Route path="/reports" element={<FacultyReports />} />
              <Route path="*" element={<Navigate to="/faculty" replace />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default FacultyDashboard;