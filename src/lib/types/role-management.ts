export interface RoleUpdate {
  description?: string;
  permissions?: string[];
}

export interface RoleCreation {
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleFilter {
  search?: string;
  permissions?: string[];
}