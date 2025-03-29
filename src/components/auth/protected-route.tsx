import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Permission } from '@/lib/types/role';
import { useAuthStore } from '@/lib/store';
import { checkPermissions } from '@/lib/rbac/permissions';

interface ProtectedRouteProps {
  children: ReactNode;
  permissions?: Permission[];
}

export function ProtectedRoute({ children, permissions = [] }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (permissions.length > 0 && !checkPermissions(user.role, permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}