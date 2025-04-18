export type UserRole = 'super_admin' | 'vendor_admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role:string;
  vendor_id:number;
  // role: 'super_admin' | 'vendor_admin' | 'staff';
}


export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}