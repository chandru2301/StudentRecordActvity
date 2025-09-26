import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard";
import StudentProfile from "./components/StudentProfile";
import FacultyProfile from "./components/FacultyProfile";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Attendance from "./pages/Attendance";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboardNew from "./components/dashboard/StudentDashboard";
import FacultyDashboardNew from "./components/dashboard/FacultyDashboard";
import EventManagement from "./components/EventManagement";
import Activities from "./pages/Activities";
import AdminActivities from "./pages/AdminActivities";
import CertificateManagement from "./pages/CertificateManagement";
import RoleBasedDashboard from "./pages/RoleBasedDashboard";
import AssessmentPage from "./pages/AssessmentPage";
import AssessmentTaking from "./components/AssessmentTaking";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Protected Routes - General */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <RoleBasedDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <PrivateRoute>
                  <Attendance />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/certificates" 
              element={
                <PrivateRoute>
                  <CertificateManagement />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/assessments" 
              element={
                <PrivateRoute>
                  <AssessmentPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/assessments/take/:id" 
              element={
                <PrivateRoute>
                  <AssessmentTaking />
                </PrivateRoute>
              } 
            />
            
            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <PrivateRoute>
                  <StudentDashboardNew />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/student/profile" 
              element={
                <PrivateRoute>
                  <StudentProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/student/activities" 
              element={
                <PrivateRoute>
                  <Activities />
                </PrivateRoute>
              } 
            />
            
            {/* Faculty Routes */}
            <Route 
              path="/faculty/dashboard" 
              element={
                <PrivateRoute>
                  <FacultyDashboardNew />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/faculty/profile" 
              element={
                <PrivateRoute>
                  <FacultyProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/faculty/events" 
              element={
                <PrivateRoute>
                  <EventManagement />
                </PrivateRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/activities" 
              element={
                <PrivateRoute>
                  <AdminActivities />
                </PrivateRoute>
              } 
            />
            
            {/* Legacy Routes - Redirect to new structure */}
            <Route path="/student/*" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/faculty/*" element={<Navigate to="/faculty/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Chatbot - Available on all pages */}
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
