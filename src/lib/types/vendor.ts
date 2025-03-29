export type VendorStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface VendorPayout {
  id: string;
  vendorId: string;
  amount: number;
  status: VendorStatus;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  paidAt?: string;
}

export interface VendorAnalytics {
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  revenueByPeriod: {
    daily: Array<{ date: string; amount: number }>;
    weekly: Array<{ date: string; amount: number }>;
    monthly: Array<{ date: string; amount: number }>;
  };
}

export interface VendorAnalyticsProps {
  analytics: VendorAnalytics;
  vendorId: string;
}