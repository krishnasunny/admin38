import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorAnalytics } from "@/lib/types/vendor";

interface StatusDistributionProps {
  analytics: VendorAnalytics;
}

export function StatusDistribution({ analytics }: StatusDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
            <Card key={status}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {status}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}