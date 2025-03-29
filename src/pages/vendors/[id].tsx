import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorAnalytics } from "@/components/vendors/vendor-analytics";
import { VendorOrders } from "@/components/vendors/vendor-orders";
import { VendorPayouts } from "@/components/vendors/vendor-payouts";
import { OrderStatus } from "@/lib/types/order";
import { mockOrders } from "@/lib/data/mock-orders";
import { VendorPayout, VendorStatus } from "@/lib/types/vendor";

// Mock data - replace with actual API calls
const mockAnalytics = {
  totalOrders: 150,
  totalRevenue: 15000,
  totalCommission: 1500,
  averageOrderValue: 100,
  ordersByStatus: {
    pending: 20,
    processing: 30,
    shipped: 40,
    delivered: 50,
    cancelled: 10,
  },
  revenueByPeriod: {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      amount: Math.floor(Math.random() * 1000),
    })),
    weekly: [],
    monthly: [],
  },
};

// const mockPayouts = Array.from({ length: 10 }, (_, i) => ({
//   id: `payout-${i + 1}`,
//   vendorId: "vendor-1",
//   amount: Math.floor(Math.random() * 10000),
//   status: ["pending", "processing", "paid", "failed"][
//     Math.floor(Math.random() * 4)
//   ],
//   //  as const,
//   periodStart: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
//   periodEnd: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
//   createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
//   paidAt: Math.random() > 0.5
//     ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
//     : undefined,
// }));

const mockPayouts: VendorPayout[] = Array.from({ length: 10 }, (_, i) => ({
  id: `payout-${i + 1}`,
  vendorId: "vendor-1",
  amount: Math.floor(Math.random() * 10000),
  status: ["pending", "processing", "paid", "failed"][
    Math.floor(Math.random() * 4)
  ] as VendorStatus, // ✅ Explicitly cast to VendorStatus
  periodStart: new Date(Date.now() - (i + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
  periodEnd: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  paidAt: Math.random() > 0.5
    ? new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
    : undefined,
}));


export default function VendorDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [orders, setOrders] = useState(mockOrders);

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const handleBulkUpdateOrderStatus = (
    orderIds: string[],
    status: OrderStatus
  ) => {
    setOrders(
      orders.map((order) =>
        orderIds.includes(order.id) ? { ...order, status } : order
      )
    );
  };

  const handleProcessPayout = (payoutId: string) => {
    // Add payout processing logic here
    console.log("Processing payout:", payoutId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendor Details</h1>
        <p className="text-muted-foreground">Manage vendor information and operations</p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <VendorAnalytics analytics={mockAnalytics} vendorId={id!} />
        </TabsContent>

        <TabsContent value="orders">
          <VendorOrders
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onBulkUpdateStatus={handleBulkUpdateOrderStatus}
          />
        </TabsContent>

        <TabsContent value="payouts">
          <VendorPayouts
            payouts={mockPayouts}
            onProcessPayout={handleProcessPayout}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}