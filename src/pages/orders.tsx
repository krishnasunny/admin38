import { useState, useMemo } from "react";
import { OrderFilters } from "@/components/orders/order-filters";
import { OrderTable } from "@/components/orders/order-table";
import { OrderDetails } from "@/components/orders/order-details";
import { ProductPagination } from "@/components/products/product-pagination";
import { Order } from "@/lib/types/order";
import { OrderFilters as FilterState } from "@/lib/types/order-filters";
import {
  filterOrders,
  sortOrders,
  paginateOrders,
} from "@/lib/utils/order-utils";
import { mockOrders } from "@/lib/data/mock-orders";

export function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
  });
  // const [sort, setSort] = useState({
  //   field: 'createdAt' as keyof Order,
  //   order: 'asc' as const,
  // });

  const [sort, setSort] = useState<{
    field: keyof Order;
    order: "asc" | "desc";
  }>({
    field: "createdAt",
    order: "desc",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const filteredOrders = useMemo(() => {
    const filtered = filterOrders(orders, filters);
    return sortOrders(filtered, sort.field, sort.order);
  }, [orders, filters, sort]);

  const paginatedOrders = useMemo(() => {
    return paginateOrders(filteredOrders, pagination.page, pagination.pageSize);
  }, [filteredOrders, pagination]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <OrderFilters filters={filters} onFilterChange={setFilters} />

      <OrderTable
        orders={paginatedOrders}
        sort={sort}
        onSort={setSort}
        onViewDetails={setSelectedOrder}
      />

      <ProductPagination
        currentPage={pagination.page}
        pageSize={pagination.pageSize}
        totalItems={filteredOrders.length}
        onPageChange={(page) => setPagination({ ...pagination, page })}
        onPageSizeChange={(pageSize) => setPagination({ page: 1, pageSize })}
      />

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
