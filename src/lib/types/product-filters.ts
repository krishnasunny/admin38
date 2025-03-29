import { ProductCategory, ProductStatus } from './product';

export interface ProductFiltersProps {
  filters: {
    search: string;
    category: ProductCategory | 'all';
    status: ProductStatus | 'all';
    minPrice?: number;
    maxPrice?: number;
  };
  onFilterChange: (filters: ProductFiltersProps['filters']) => void;
}