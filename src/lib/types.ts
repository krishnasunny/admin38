export interface Vendor {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
  productsCount: number;
  totalSales: number;
}

export interface Product {
  id: string;
  name: string;
  vendorId: string;
  price: number;
  status: 'active' | 'draft' | 'pending' | 'rejected';
  stock: number;
  category: string;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  createdAt: string;
}

// export interface DashboardStats {
//   totalVendors: number;
//   activeVendors: number;
//   totalProducts: number;
//   totalOrders: number;
//   totalSales: number;
//   recentOrders: Order[];
//   topVendors: Vendor[];
// }


export interface DashboardStats {
  totalVendors: number;
  activeVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalSales: number;
  recentOrders: RecentOrder[];
  // topVendors: VendorStats[]; // Assuming VendorStats is another type
  trends: {
    vendors: { value: number; isPositive: boolean };
    products: { value: number; isPositive: boolean };
    orders: { value: number; isPositive: boolean };
    revenue: { value: number; isPositive: boolean };
  };
}



export interface RecentOrder {
  id: string;
  customer: string;
  status: string;
  total: string;
  items: number;
  date: string;
}


export interface TrendData {
  value: number;
  isPositive: boolean;
}

export interface DashboardStats {
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  trends: {
    vendors: TrendData;
    products: TrendData;
    orders: TrendData;
    revenue: TrendData;
  };
}

export interface SalesData {
  name: string;
  sales: number;
}



export interface User {
  id: string;
  email: string;
  name: string;
  role: string; 
  // role: 'super_admin' | 'admin' | 'vendor' | 'customer'; // Extend roles if needed
}


