export type Role = "super_admin" | "vendor_admin" | "staff" | "customer";

export type Permission =
  // Dashboard permissions
  | "dashboard.view"
  | "vendors-dash.view"
  // Product permissions
  | "products.view"
  | "products.create"
  | "products.edit"
  | "products.delete"
  // Order permissions
  | "orders.view"
  | "orders.update"
  | "orders.cancel"
  // Vendor permissions
  | "vendors.view"
  | "vendors.create"
  | "vendors.edit"
  | "vendors.delete"
  // User permissions
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  // Report permissions
  | "reports.view"
  | "reports.export"
  // Settings permissions
  | "settings.view"
  | "settings.edit";

export interface RoleConfig {
  name: Role;
  description: string;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}
