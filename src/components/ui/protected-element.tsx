import { ReactNode } from 'react';
import { Permission } from '@/lib/types/role';
import { useAuthStore } from '@/lib/store';
import { checkPermissions } from '@/lib/rbac/permissions';

interface ProtectedElementProps {
  children: ReactNode;
  permissions: Permission[];
  fallback?: ReactNode;
}

export function ProtectedElement({ 
  children, 
  permissions, 
  fallback = null 
}: ProtectedElementProps) {
  const { user } = useAuthStore();

  if (!user || !checkPermissions(user.role, permissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}