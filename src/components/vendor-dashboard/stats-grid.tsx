import { Users, Package, ShoppingCart, DollarSign } from 'lucide-react';
import { StatsCard } from './stats-card';
import { DashboardStats } from 'src/lib/types';

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Vendors"
        value={stats.totalVendors.toString()}
        icon={Users}
        trend={stats.trends.vendors}
        description="Since last month"
      />
      <StatsCard
        title="Total Products"
        value={stats.totalProducts.toString()}
        icon={Package}
        trend={stats.trends.products}
        description="Since last month"
      />
      <StatsCard
        title="Total Orders"
        value={stats.totalOrders.toString()}
        icon={ShoppingCart}
        trend={stats.trends.orders}
        description="Since last month"
      />
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={DollarSign}
        trend={stats.trends.revenue}
        description="Since last month"
      />
    </div>
  );
}
