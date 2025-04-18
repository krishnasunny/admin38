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
  subcategory_id: string;
  name: string;
  description?: string;
  image_url?: string;
  category_id: number;
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
