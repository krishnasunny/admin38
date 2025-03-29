import { Order } from '@/lib/types/order';
import { OrderFilters } from '@/lib/types/order-filters';

export const filterOrders = (orders: Order[], filters: OrderFilters): Order[] => {
  return orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.id.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesDateFrom = !filters.dateFrom || new Date(order.createdAt) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(order.createdAt) <= new Date(filters.dateTo);
    const matchesTotal =
      (!filters.minTotal || order.total >= filters.minTotal) &&
      (!filters.maxTotal || order.total <= filters.maxTotal);

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo && matchesTotal;
  });
};

export const sortOrders = (orders: Order[], field: keyof Order, order: 'asc' | 'desc'): Order[] => {
  return [...orders].sort((a, b) => {
    const multiplier = order === 'asc' ? 1 : -1;
    return multiplier * (a[field] > b[field] ? 1 : -1);
  });
};

export const paginateOrders = (orders: Order[], page: number, pageSize: number): Order[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return orders.slice(start, end);
};