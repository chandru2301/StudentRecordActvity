import { NavLink, useLocation } from "react-router-dom";
import { useRole } from "../hooks/useRole";
import {
  CheckCircle, Calendar, MessageSquare, FileCheck, CalendarDays, BarChart3,
  Activity, Upload, Bell, FileText, User, GraduationCap, Eye, Home, Settings, Award
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
// Icon mapping for dynamic icon rendering
const iconMap = {
  Home,
  User,
  GraduationCap,
  Activity,
  Calendar,
  Award,
  Upload,
  Bell,
  FileText,
  CheckCircle,
  MessageSquare,
  FileCheck,
  CalendarDays,
  BarChart3,
  Eye,
  Settings,
};

interface AppSidebarProps {
  role?: 'student' | 'faculty'; // Made optional since we'll get it from auth context
}

export function AppSidebar({ role: propRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { 
    user, 
    roleConfig, 
    sidebarItems, 
    displayName, 
    isStudent, 
    isFaculty, 
    isAdmin 
  } = useRole();
  
  // Use prop role as fallback
  const effectiveRole = propRole || (isStudent ? 'student' : 'faculty');
  
  const roleTitle = isFaculty ? 'Faculty Portal' : isStudent ? 'Student Portal' : 'Admin Portal';
  const roleIcon = isFaculty ? GraduationCap : isStudent ? User : Settings;

  const isActive = (path: string) => currentPath === path;

  // Get the appropriate icon component
  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || Home;
  };

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <div className={`${
            isFaculty ? 'bg-secondary/10' : 
            isStudent ? 'bg-primary/10' : 
            'bg-destructive/10'
          } p-2 rounded-lg`}>
            <roleIcon className={`h-6 w-6 ${
              isFaculty ? 'text-secondary' : 
              isStudent ? 'text-primary' : 
              'text-destructive'
            }`} />
          </div>
          {state !== "collapsed" && (
            <div>
              <h3 className="font-semibold text-sm">{roleTitle}</h3>
              <p className="text-xs text-muted-foreground capitalize">
                {roleConfig?.displayName || effectiveRole} Dashboard
              </p>
              {user && (
                <p className="text-xs text-muted-foreground">{displayName}</p>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dynamic Navigation based on role */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {state !== "collapsed" && (roleConfig?.displayName || 'Navigation')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const IconComponent = getIcon(item.icon);
                return (
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
                        title={state === "collapsed" ? item.description : undefined}
                      >
                        <IconComponent className="h-4 w-4" />
                          {state !== "collapsed" && (
                          <div className="flex flex-col items-start">
                            <span className="text-sm">{item.title}</span>
                            {/* {item.description && (
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )} */}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}