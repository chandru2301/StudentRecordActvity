import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  CheckCircle, Calendar, MessageSquare, FileCheck, CalendarDays, BarChart3,
  Activity, Upload, Bell, FileText, User, GraduationCap, Eye, Home, Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
// Common menu items for all users - will be set dynamically based on role
const getCommonMenuItems = (role: 'student' | 'faculty') => {
  const dashboardUrl = role === 'student' ? '/student/dashboard' : '/faculty/dashboard';
  return [
    { title: "Dashboard", url: dashboardUrl, icon: Home },
    { title: "Profile", url: "", icon: Eye }, // Will be set dynamically based on role
  ];
};

// Faculty-specific menu items
const facultyMenuItems = [
  { title: "Student Activity Validation", url: "/faculty/validation", icon: CheckCircle },
  { title: "Attendance Monitoring", url: "/attendance", icon: Calendar },
  { title: "Feedback & Mentoring Logs", url: "/faculty/feedback", icon: MessageSquare },
  { title: "Document Review & Approval", url: "/faculty/documents", icon: FileCheck },
  { title: "Faculty Schedule & Calendar", url: "/faculty/schedule", icon: CalendarDays },
  { title: "Report Generation Tools", url: "/faculty/reports", icon: BarChart3 },
  { title: "Event Management", url: "/faculty/events", icon: CalendarDays },
  { title: "All Activities", url: "/admin/activities", icon: Activity },
];

// Student-specific menu items
const studentMenuItems = [
  { title: "My Activities", url: "/student/activities", icon: Activity },
  { title: "Document Upload & Verification", url: "/student/documents", icon: Upload },
  { title: "Event & Deadline Alerts", url: "/student/alerts", icon: Bell },
  { title: "Comprehensive Reports", url: "/student/reports", icon: FileText },
];

interface AppSidebarProps {
  role?: 'student' | 'faculty'; // Made optional since we'll get it from auth context
}

export function AppSidebar({ role: propRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  
  // Determine role from auth context or prop (fallback)
  const userRole = user?.role === 'STUDENT' ? 'student' : 'faculty';
  const role = propRole || userRole;
  
  // Build menu items based on role
  const commonItems = getCommonMenuItems(role).map(item => ({
    ...item,
    url: item.title === 'Profile' 
      ? (role === 'student' ? '/student/profile' : '/faculty/profile')
      : item.url
  }));
  
  const roleSpecificItems = role === 'faculty' ? facultyMenuItems : studentMenuItems;
  const menuItems = [...commonItems, ...roleSpecificItems];
  
  const roleTitle = role === 'faculty' ? 'Faculty Portal' : 'Student Portal';
  const roleIcon = role === 'faculty' ? GraduationCap : User;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <div className={`${role === 'faculty' ? 'bg-secondary/10' : 'bg-primary/10'} p-2 rounded-lg`}>
            {role === 'faculty' ? (
              <GraduationCap className="h-6 w-6 text-secondary" />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          {state !== "collapsed" && (
            <div>
              <h3 className="font-semibold text-sm">{roleTitle}</h3>
              <p className="text-xs text-muted-foreground capitalize">{role} Dashboard</p>
              {user && (
                <p className="text-xs text-muted-foreground">{user.username}</p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Common Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted/50'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role-specific Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {state !== "collapsed" && (role === 'faculty' ? 'Faculty Tools' : 'Student Tools')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roleSpecificItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted/50'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}