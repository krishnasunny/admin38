export interface SalesData {
  name: string;
  sales: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  status: string;
  total: string;
  items: number;
  date: string;
}

export interface DashboardStats {
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  trends: {
    vendors: { value: number; isPositive: boolean };
    products: { value: number; isPositive: boolean };
    orders: { value: number; isPositive: boolean };
    revenue: { value: number; isPositive: boolean };
  };
}