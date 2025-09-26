import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RoleManager, { RoleConfig, SidebarItem, UserRole } from '../utils/roleManager';

export interface UseRoleReturn {
  user: any;
  role: UserRole | null;
  roleConfig: RoleConfig | null;
  permissions: Record<string, boolean>;
  sidebarItems: SidebarItem[];
  defaultRoute: string;
  displayName: string;
  profileInfo: {
    name: string;
    email: string;
    role: string;
    additionalInfo: Record<string, any>;
  };
  navigationItems: Array<{
    name: string;
    href: string;
    requiresAuth: boolean;
    requiresPermission?: string;
  }>;
  dashboardWidgets: Array<{
    title: string;
    description: string;
    icon: string;
    url: string;
    requiresPermission?: string;
  }>;
  quickActions: Array<{
    title: string;
    description: string;
    icon: string;
    action: string;
    requiresPermission?: string;
  }>;
  hasPermission: (permission: string) => boolean;
  canAccessRoute: (route: string) => boolean;
  isStudent: boolean;
  isFaculty: boolean;
  isAdmin: boolean;
}

export const useRole = (): UseRoleReturn => {
  const { user } = useAuth();

  return useMemo(() => {
    const role = user?.role as UserRole || null;
    const roleConfig = RoleManager.getRoleConfig(user);
    const permissions = roleConfig?.permissions || {};
    const sidebarItems = RoleManager.getSidebarItems(user);
    const defaultRoute = RoleManager.getDefaultRoute(user);
    const displayName = RoleManager.getUserDisplayName(user);
    const profileInfo = RoleManager.getUserProfileInfo(user);
    const navigationItems = RoleManager.getNavigationItems(user);
    const dashboardWidgets = RoleManager.getDashboardWidgets(user);
    const quickActions = RoleManager.getQuickActions(user);

    const hasPermission = (permission: string): boolean => {
      return RoleManager.hasPermission(user, permission as any);
    };

    const canAccessRoute = (route: string): boolean => {
      return RoleManager.canAccessRoute(user, route);
    };

    return {
      user,
      role,
      roleConfig,
      permissions,
      sidebarItems,
      defaultRoute,
      displayName,
      profileInfo,
      navigationItems,
      dashboardWidgets,
      quickActions,
      hasPermission,
      canAccessRoute,
      isStudent: role === 'STUDENT',
      isFaculty: role === 'FACULTY',
      isAdmin: role === 'ADMIN',
    };
  }, [user]);
};

export default useRole;
