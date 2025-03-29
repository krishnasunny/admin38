import { create } from 'zustand';
import { roleConfigs } from '@/lib/rbac/roles';
import { RoleConfig } from '@/lib/types/role';
import { logAction } from '@/lib/rbac/audit';
import { useAuthStore } from './auth.store';

interface RolesState {
  roles: Record<string, RoleConfig>;
  addRole: (role: RoleConfig) => void;
  updateRole: (name: string, updates: Partial<RoleConfig>) => void;
  deleteRole: (name: string) => void;
}

export const useRolesStore = create<RolesState>((set
  // , get
) => ({
  roles: roleConfigs,
  
  addRole: (role: RoleConfig) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => ({
      roles: {
        ...state.roles,
        [role.name]: role,
      },
    }));

    logAction(
      user.id,
      user.name,
      'create',
      'role',
      `Created new role: ${role.name}`
    );
  },

  updateRole: (name: string, updates: Partial<RoleConfig>) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => ({
      roles: {
        ...state.roles,
        [name]: {
          ...state.roles[name],
          ...updates,
        },
      },
    }));

    logAction(
      user.id,
      user.name,
      'update',
      'role',
      `Updated role: ${name}`
    );
  },

  deleteRole: (name: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set((state) => {
      const newRoles = { ...state.roles };
      delete newRoles[name];
      return { roles: newRoles };
    });

    logAction(
      user.id,
      user.name,
      'delete',
      'role',
      `Deleted role: ${name}`
    );
  },
}));