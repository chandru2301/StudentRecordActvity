import React from 'react';
import { useRole } from '../hooks/useRole';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: 'STUDENT' | 'FACULTY' | 'ADMIN';
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback = null,
  requireAuth = true,
}) => {
  const { user, hasPermission, isStudent, isFaculty, isAdmin } = useRole();

  // Check authentication
  if (requireAuth && !user) {
    return <>{fallback}</>;
  }

  // Check role requirement
  if (requiredRole) {
    const roleChecks = {
      STUDENT: isStudent,
      FACULTY: isFaculty,
      ADMIN: isAdmin,
    };

    if (!roleChecks[requiredRole]) {
      return <>{fallback}</>;
    }
  }

  // Check permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface ConditionalRenderProps {
  children: React.ReactNode;
  condition: boolean;
  fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  condition,
  fallback = null,
}) => {
  return condition ? <>{children}</> : <>{fallback}</>;
};

interface RoleBasedComponentProps {
  student?: React.ReactNode;
  faculty?: React.ReactNode;
  admin?: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  student,
  faculty,
  admin,
  fallback = null,
}) => {
  const { isStudent, isFaculty, isAdmin } = useRole();

  if (isStudent && student) {
    return <>{student}</>;
  }

  if (isFaculty && faculty) {
    return <>{faculty}</>;
  }

  if (isAdmin && admin) {
    return <>{admin}</>;
  }

  return <>{fallback}</>;
};

export default RoleGuard;
