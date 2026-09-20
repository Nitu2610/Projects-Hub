import { ProductImage } from "../components/admin/products/ProductImageUpload";

export interface ProductCategory {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  images: ProductImage[];
  color?: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  specification: Record<string, string>;
  category: ProductCategory;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    pagination: ProductPagination;
  };
}

export interface GetProductDetailsResponse {
  success: boolean;
  message: string;
  data: Product;
}
