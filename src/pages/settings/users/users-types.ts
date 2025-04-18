export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: "super_admin" | "vendor_admin" | "staff";
  created_at: string;
}
