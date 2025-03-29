import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorAnalytics } from "@/lib/types/vendor";

interface MetricsCardsProps {
  analytics: VendorAnalytics;
}

export function MetricsCards({ analytics }: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Revenue",
      value: `₹${analytics.totalRevenue.toLocaleString()}`,
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toLocaleString(),
    },
    {
      title: "Total Commission",
      value: `₹${analytics.totalCommission.toLocaleString()}`,
    },
    {
      title: "Average Order Value",
      value: `₹${analytics.averageOrderValue.toLocaleString()}`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}