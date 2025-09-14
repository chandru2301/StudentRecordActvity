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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
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
              path="/faculty/profile" 
              element={
                <PrivateRoute>
                  <FacultyProfile />
                </PrivateRoute>
              } 
            />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route 
              path="/student/dashboard" 
              element={
                <PrivateRoute>
                  <StudentDashboardNew />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/faculty/dashboard" 
              element={
                <PrivateRoute>
                  <FacultyDashboardNew />
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
            <Route 
              path="/student/activities" 
              element={
                <PrivateRoute>
                  <Activities />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/activities" 
              element={
                <PrivateRoute>
                  <AdminActivities />
                </PrivateRoute>
              } 
            />
            <Route path="/student/*" element={<StudentDashboard />} />
            <Route path="/faculty/*" element={<FacultyDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
