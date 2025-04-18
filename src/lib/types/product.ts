export type ProductCategory = string;
  // | "ram4"
  // | "clothing"
  // | "books"
  // | "food"
  // | "other";
export type ProductStatus = "active" | "draft" | "archived";

interface ProductVariant {
  variant_id?: number;
  variant_name: string;
  variant_price: number;
  stock_quantity: number;
  sku?: string;
}

interface ProductImage {
  image_id?: number;
  image_url: string;
  is_primary: boolean;
}

export interface Product {
  product_id: number;
  vendor_id: number;
  category_id: number;
  subcategory_id: string;
  product_name: string;
  description: string;
  // base_price: string | number;
  base_price: number;
  sku: string;
  created_at: string;
  updated_at: string;
  discounted_price: number | null;
  store_name: string;
  category_name: string;
  subcategory_name: string;
  variants: ProductVariant[];
  images: ProductImage[];
  status: "active" | "draft" | "archived";
}

export interface CreateProductPayload {
  vendor_id: number;
  category_id: number;
  subcategory_id: string;
  product_name: string;
  description: string;
  base_price: number;
  sku: string;
  variants: Omit<ProductVariant, "variant_id">[];
  images: Omit<ProductImage, "image_id">[];
}

export interface ProductSort {
  field: keyof Product;
  order: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface ProductFilters {
  search: string;
  category_name: ProductCategory | "all";
  status: ProductStatus | "all";
  minPrice?: number;
  maxPrice?: number;
}

// export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'food' | 'other';
// export type ProductStatus = 'active' | 'draft' | 'archived';

// interface ProductVariant {
//   name: string;
//   price: number;
//   stock_quantity: number;
//   sku: string;
// }

// interface ProductImage {
//   image_url: string;
//   is_primary: boolean;
// }

// export interface Product {
//   product_id: string;
//   vendor_id: number;
//   category_id: number;
//   subcategory_id: string;
//   product_name: string;
//   description: string;
//   base_price: number;
//   sku: string;
//   variants: ProductVariant[];
//   images: ProductImage[];
//   status: ProductStatus;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ProductSort {
//   field: keyof Product;
//   order: 'asc' | 'desc';
// }

// export interface PaginationState {
//   page: number;
//   pageSize: number;
// }

// export interface ProductFilters {
//   search: string;
//   category: ProductCategory | 'all';
//   status: ProductStatus | 'all';
//   minPrice?: number;
//   maxPrice?: number;
// }

// export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'food' | 'other';
// export type ProductStatus = 'active' | 'draft' | 'archived';

// export interface ProductImage {
//   id: string;
//   url: string;
//   isPrimary: boolean;
// }

// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: ProductCategory;
//   status: ProductStatus;
//   stock: number;
//   sku: string;
//   imageUrl?: string;
//   images: ProductImage[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ProductSort {
//   field: keyof Product;
//   order: 'asc' | 'desc';
// }

// export interface PaginationState {
//   page: number;
//   pageSize: number;
// }

// export interface ProductFilters {
//   search: string;
//   category: ProductCategory | 'all';
//   status: ProductStatus | 'all';
//   minPrice?: number;
//   maxPrice?: number;
// }
