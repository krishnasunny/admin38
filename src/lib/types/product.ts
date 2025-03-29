export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'food' | 'other';
export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  sku: string;
  imageUrl?: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSort {
  field: keyof Product;
  order: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface ProductFilters {
  search: string;
  category: ProductCategory | 'all';
  status: ProductStatus | 'all';
  minPrice?: number;
  maxPrice?: number;
}

