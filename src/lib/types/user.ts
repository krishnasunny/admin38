export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'vendor_admin' | 'staff';
}