export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  image?: File;
}

export interface SubcategoryFormData {
  name: string;
  description?: string;
  image?: File;
  categoryId: string;
}