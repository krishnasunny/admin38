import { Permission, Role } from '../types/role';
import { roleConfigs } from './roles';

export function hasPermission(userRole: Role, permission: Permission): boolean {
  const roleConfig = roleConfigs[userRole];
  return roleConfig?.permissions.includes(permission) ?? false;
}

export function checkPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}