import {
  //  ProductCategory, 
  ProductStatus } from './product';

export interface ProductFiltersProps {
  filters: {
    search: string;
    category_name: string | 'all' ;
    status: ProductStatus | 'all';
    minPrice?: number;
    maxPrice?: number;
  };
  onFilterChange: (filters: ProductFiltersProps['filters']) => void;
}