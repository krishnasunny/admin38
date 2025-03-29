import { useState } from 'react';
import { Download } from 'lucide-react';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { RecentOrders } from '@/components/dashboard/recent-orders';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DashboardStats, SalesData, RecentOrder } from '@/lib/types';


// const mockStats: DashboardStats = {
//   totalVendors: 0, // Not relevant for vendor dashboard
//   totalProducts: 45,
//   totalOrders: 156,
//   totalRevenue: 23450,
//   trends: {
//     vendors: { value: 0, isPositive: true }, // Not relevant for vendor dashboard
//     products: { value: 12, isPositive: true },
//     orders: { value: 8, isPositive: true },
//     revenue: { value: 15, isPositive: true },
//   },
// };

const salesData: SalesData[] = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const recentOrders: RecentOrder[] = [
  {
    id: '1',
    customer: 'John Doe',
    status: 'Processing',
    total: '$250.00',
    items: 3,
    date: '2024-01-15',
  },
];

const mockStats: DashboardStats = {
  totalVendors: 0, // Not relevant for vendor dashboard
  activeVendors: 0, // Added missing property
  totalProducts: 45,
  totalOrders: 156,
  totalRevenue: 23450,
  totalSales: 23450, // Added missing property
  recentOrders: recentOrders, // Now recentOrders is defined before use
  trends: {
    vendors: { value: 0, isPositive: true }, // Not relevant for vendor dashboard
    products: { value: 12, isPositive: true },
    orders: { value: 8, isPositive: true },
    revenue: { value: 15, isPositive: true },
  },
};

export function VendorDashboardPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const handleDownloadReport = () => {
    if (!dateRange.from || !dateRange.to) {
      return;
    }

    // In a real application, this would make an API call to generate and download the report
    const reportData = {
      dateRange,
      stats: mockStats,
      salesData,
      orders: recentOrders,
    };

    // Create a JSON blob and download it
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendor-report-${dateRange.from.toISOString().split('T')[0]}-to-${
      dateRange.to.toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your store's performance
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Date Range for Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Calendar
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  });
                }}
                numberOfMonths={2}
                className="rounded-md border"
              />
              <Button
                className="w-full"
                onClick={handleDownloadReport}
                disabled={!dateRange.from || !dateRange.to}
              >
                Download Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <StatsGrid stats={mockStats} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <SalesChart
          data={salesData}
          title="Your Sales Overview"
          description="Your store's sales performance"
        />
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}