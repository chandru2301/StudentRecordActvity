import { User, StudentProfile, FacultyProfile } from '../services/authService';

export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface RolePermissions {
  canViewDashboard: boolean;
  canUploadCertificates: boolean;
  canApproveCertificates: boolean;
  canViewAttendance: boolean;
  canManageEvents: boolean;
  canViewAnalytics: boolean;
  canManageActivities: boolean;
  canViewAllStudents: boolean;
  canViewAllFaculty: boolean;
  canManageSystem: boolean;
  canTakeAssessments: boolean;
  canCreateAssessments: boolean;
  canGradeAssessments: boolean;
}

export interface RoleConfig {
  name: string;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  permissions: RolePermissions;
  defaultRoute: string;
  sidebarItems: SidebarItem[];
}

export interface SidebarItem {
  title: string;
  url: string;
  icon: string;
  description?: string;
  badge?: string;
  requiresPermission?: keyof RolePermissions;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  STUDENT: {
    name: 'STUDENT',
    displayName: 'Student',
    description: 'Student Portal Access',
    color: 'primary',
    icon: 'User',
    permissions: {
      canViewDashboard: true,
      canUploadCertificates: true,
      canApproveCertificates: false,
      canViewAttendance: true,
      canManageEvents: false,
      canViewAnalytics: true,
      canManageActivities: false,
      canViewAllStudents: false,
      canViewAllFaculty: false,
      canManageSystem: false,
      canTakeAssessments: true,
      canCreateAssessments: false,
      canGradeAssessments: false,
    },
    defaultRoute: '/student/dashboard',
    sidebarItems: [
      { title: 'Dashboard', url: '/student/dashboard', icon: 'Home', description: 'Your personal dashboard' },
      { title: 'My Activities', url: '/student/activities', icon: 'Activity', description: 'Track your activities' },
      { title: 'Show Attendance', url: '/attendance', icon: 'Calendar', description: 'View your attendance' },
      { title: 'Assessments', url: '/assessments', icon: 'FileText', description: 'Take quizzes and tests' },
      { title: 'Certificate Management', url: '/certificates', icon: 'Award', description: 'Upload and track certificates' },
      // { title: 'Document Upload', url: '/student/profile', icon: 'Upload', description: 'Upload documents' },
      { title: 'Event Alerts', url: '/student/profile', icon: 'Bell', description: 'View event notifications' },
      { title: 'Reports', url: '/analytics', icon: 'FileText', description: 'View your reports' },
      { title: 'Profile', url: '/student/profile', icon: 'Eye', description: 'Manage your profile' },
    ],
  },
  FACULTY: {
    name: 'FACULTY',
    displayName: 'Faculty',
    description: 'Faculty Portal Access',
    color: 'secondary',
    icon: 'GraduationCap',
    permissions: {
      canViewDashboard: true,
      canUploadCertificates: false,
      canApproveCertificates: true,
      canViewAttendance: true,
      canManageEvents: true,
      canViewAnalytics: true,
      canManageActivities: true,
      canViewAllStudents: true,
      canViewAllFaculty: false,
      canManageSystem: false,
      canTakeAssessments: false,
      canCreateAssessments: true,
      canGradeAssessments: true,
    },
    defaultRoute: '/faculty/dashboard',
    sidebarItems: [
      { title: 'Dashboard', url: '/faculty/dashboard', icon: 'Home', description: 'Faculty dashboard' },
      { title: 'Assessment Management', url: '/assessments', icon: 'FileText', description: 'Create and manage assessments' },
      // { title: 'Activity Validation', url: '/faculty/profile', icon: 'CheckCircle', description: 'Validate student activities' },
      { title: 'Attendance Monitoring', url: '/attendance', icon: 'Calendar', description: 'Monitor student attendance' },
      { title: 'Certificate Approval', url: '/certificates', icon: 'Award', description: 'Review and approve certificates' },
      // { title: 'Feedback & Mentoring', url: '/faculty/profile', icon: 'MessageSquare', description: 'Student feedback logs' },
      // { title: 'Document Review', url: '/faculty/profile', icon: 'FileCheck', description: 'Review student documents' },
      // { title: 'Schedule & Calendar', url: '/faculty/profile', icon: 'CalendarDays', description: 'Manage schedule' },
      { title: 'Report Generation', url: '/analytics', icon: 'BarChart3', description: 'Generate reports' },
      { title: 'Event Management', url: '/faculty/events', icon: 'CalendarDays', description: 'Manage events' },
      { title: 'All Activities', url: '/admin/activities', icon: 'Activity', description: 'View all activities' },
      { title: 'Profile', url: '/faculty/profile', icon: 'Eye', description: 'Manage your profile' },
    ],
  },
  ADMIN: {
    name: 'ADMIN',
    displayName: 'Administrator',
    description: 'System Administrator Access',
    color: 'destructive',
    icon: 'Settings',
    permissions: {
      canViewDashboard: true,
      canUploadCertificates: false,
      canApproveCertificates: true,
      canViewAttendance: true,
      canManageEvents: true,
      canViewAnalytics: true,
      canManageActivities: true,
      canViewAllStudents: true,
      canViewAllFaculty: true,
      canManageSystem: true,
      canTakeAssessments: false,
      canCreateAssessments: true,
      canGradeAssessments: true,
    },
    defaultRoute: '/admin/dashboard',
    sidebarItems: [
      { title: 'Admin Dashboard', url: '/admin/dashboard', icon: 'Home', description: 'System overview' },
      { title: 'User Management', url: '/admin/users', icon: 'Users', description: 'Manage users' },
      { title: 'System Settings', url: '/admin/settings', icon: 'Settings', description: 'System configuration' },
      { title: 'All Activities', url: '/admin/activities', icon: 'Activity', description: 'Manage all activities' },
      { title: 'Certificate Management', url: '/certificates', icon: 'Award', description: 'Manage certificates' },
      { title: 'Attendance Reports', url: '/attendance', icon: 'Calendar', description: 'Attendance analytics' },
      { title: 'Event Management', url: '/faculty/events', icon: 'CalendarDays', description: 'Manage events' },
      { title: 'Analytics', url: '/analytics', icon: 'BarChart3', description: 'System analytics' },
    ],
  },
};

export class RoleManager {
  /**
   * Get role configuration for a user
   */
  static getRoleConfig(user: User | null): RoleConfig | null {
    if (!user) return null;
    return ROLE_CONFIGS[user.role as UserRole] || null;
  }

  /**
   * Check if user has a specific permission
   */
  static hasPermission(user: User | null, permission: keyof RolePermissions): boolean {
    const roleConfig = this.getRoleConfig(user);
    return roleConfig?.permissions[permission] || false;
  }

  /**
   * Get user's default route based on role
   */
  static getDefaultRoute(user: User | null): string {
    const roleConfig = this.getRoleConfig(user);
    return roleConfig?.defaultRoute || '/';
  }

  /**
   * Get sidebar items for user's role
   */
  static getSidebarItems(user: User | null): SidebarItem[] {
    const roleConfig = this.getRoleConfig(user);
    return roleConfig?.sidebarItems || [];
  }

  /**
   * Check if user can access a specific route
   */
  static canAccessRoute(user: User | null, route: string): boolean {
    const sidebarItems = this.getSidebarItems(user);
    return sidebarItems.some(item => item.url === route);
  }

  /**
   * Get user's display name with role
   */
  static getUserDisplayName(user: User | null): string {
    if (!user) return 'Guest';
    const roleConfig = this.getRoleConfig(user);
    const profileName = user.profile?.name || user.username;
    return `${profileName} (${roleConfig?.displayName || user.role})`;
  }

  /**
   * Get user's profile information
   */
  static getUserProfileInfo(user: User | null): {
    name: string;
    email: string;
    role: string;
    additionalInfo: Record<string, any>;
  } {
    if (!user) {
      return {
        name: 'Guest',
        email: '',
        role: 'GUEST',
        additionalInfo: {},
      };
    }

    const roleConfig = this.getRoleConfig(user);
    const profile = user.profile;

    let additionalInfo: Record<string, any> = {};

    if (user.role === 'STUDENT' && profile) {
      const studentProfile = profile as StudentProfile;
      additionalInfo = {
        rollNumber: studentProfile.rollNumber,
        degree: studentProfile.degree,
        type: studentProfile.type,
        dob: studentProfile.dob,
      };
    } else if (user.role === 'FACULTY' && profile) {
      const facultyProfile = profile as FacultyProfile;
      additionalInfo = {
        department: facultyProfile.department,
      };
    }

    return {
      name: profile?.name || user.username,
      email: profile?.email || user.email,
      role: roleConfig?.displayName || user.role,
      additionalInfo,
    };
  }

  /**
   * Get role-based navigation items
   */
  static getNavigationItems(user: User | null): Array<{
    name: string;
    href: string;
    requiresAuth: boolean;
    requiresPermission?: keyof RolePermissions;
  }> {
    const baseItems = [
      { name: 'Home', href: '/', requiresAuth: false },
      { name: 'About', href: '#about', requiresAuth: false },
      { name: 'Services', href: '#services', requiresAuth: false },
    ];

    if (!user) {
      return [
        ...baseItems,
        { name: 'Login', href: '/login', requiresAuth: false },
        { name: 'Register', href: '/register', requiresAuth: false },
      ];
    }

    const roleItems = this.getSidebarItems(user).map(item => ({
      name: item.title,
      href: item.url,
      requiresAuth: true,
      requiresPermission: item.requiresPermission,
    }));

    return [
      ...baseItems,
      ...roleItems,
      { name: 'Help', href: '#help', requiresAuth: false },
    ];
  }

  /**
   * Get role-based dashboard widgets
   */
  static getDashboardWidgets(user: User | null): Array<{
    title: string;
    description: string;
    icon: string;
    url: string;
    requiresPermission?: keyof RolePermissions;
  }> {
    if (!user) return [];

    const widgets = [];

    if (this.hasPermission(user, 'canViewDashboard')) {
      widgets.push({
        title: 'Dashboard Overview',
        icon: 'Home',
        url: this.getDefaultRoute(user),
      });
    }

    if (this.hasPermission(user, 'canUploadCertificates')) {
      widgets.push({
        title: 'Upload Certificates',
        icon: 'Award',
        url: '/certificates',
        requiresPermission: 'canUploadCertificates',
      });
    }

    if (this.hasPermission(user, 'canApproveCertificates')) {
      widgets.push({
        title: 'Certificate Approval',    
        icon: 'CheckCircle',
        url: '/certificates',
        requiresPermission: 'canApproveCertificates',
      });
    }

    if (this.hasPermission(user, 'canViewAttendance')) {
      widgets.push({
        title: 'Attendance',
        icon: 'Calendar',
        url: '/attendance',
        requiresPermission: 'canViewAttendance',
      });
    }

    if (this.hasPermission(user, 'canManageEvents')) {
      widgets.push({
        title: 'Event Management',
        icon: 'CalendarDays',
        url: '/faculty/events',
        requiresPermission: 'canManageEvents',
      });
    }

    if (this.hasPermission(user, 'canViewAnalytics')) {
      widgets.push({
        title: 'Analytics',
        icon: 'BarChart3',
        url: '/analytics',
        requiresPermission: 'canViewAnalytics',
      });
    }

    return widgets;
  }

  /**
   * Get role-based quick actions
   */
  static getQuickActions(user: User | null): Array<{
    title: string;
    description: string;
    icon: string;
    action: string;
    requiresPermission?: keyof RolePermissions;
  }> {
    if (!user) return [];

    const actions = [];

    if (this.hasPermission(user, 'canUploadCertificates')) {
      actions.push({
        title: 'Upload Certificate',
        icon: 'Upload',
        action: 'upload-certificate',
        requiresPermission: 'canUploadCertificates',
      });
    }

    if (this.hasPermission(user, 'canApproveCertificates')) {
      actions.push({
        title: 'Review Certificates',
        icon: 'Eye',
        action: 'review-certificates',
        requiresPermission: 'canApproveCertificates',
      });
    }

    if (this.hasPermission(user, 'canManageEvents')) {
      actions.push({
        title: 'Create Event',
        description: 'Create a new event',
        icon: 'Plus',
        action: 'create-event',
        requiresPermission: 'canManageEvents',
      });
    }

    if (this.hasPermission(user, 'canManageActivities')) {
      actions.push({
        title: 'Add Activity',
        description: 'Add a new activity',
        icon: 'Activity',
        action: 'add-activity',
        requiresPermission: 'canManageActivities',
      });
    }

    return actions;
  }
}

export default RoleManager;
