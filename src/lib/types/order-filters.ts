import { OrderStatus } from './order';

export interface OrderFilters {
  search: string;
  status: OrderStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  minTotal?: number;
  maxTotal?: number;
}

export interface OrderFiltersProps {
  filters: OrderFilters;
  onFilterChange: (filters: OrderFilters) => void;
}