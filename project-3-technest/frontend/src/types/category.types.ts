export interface ParentCategory {
  _id: string | null;
  name: string | null;
}

export interface AddCategoryRequest {
  name: string;
  parent?: string | null;
}

export interface UpdateCategoryRequest {
  id: string;
  name: string;
}

export interface UpdateCategoryStatusRequest {
  id: string;
  active: boolean;
}

export interface CustomerCategory {
  _id: string;
  name: string;
  active: boolean;
  parent: ParentCategory | null;
  productCount?: number;
}

export interface AdminCategory {
  _id: string;
  name: string;
  active: boolean;
  parent: ParentCategory | null;
  productCount: number;
}

export interface CategoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoriesResponse {
  categories: CustomerCategory[];
  parentCategories: ParentCategory[];
  pagination: CategoryPagination;
}

export interface CategoryViewModel {
  _id: string;
  name: string;
  active: boolean;
  parentId: string | null;
  parentName: string | null;
  productCount?: number;
}