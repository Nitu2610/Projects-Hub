export interface Specification {
  [key: string]: string;
}

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface ProductData {
  title: string;
  description: string;
  images: ProductImage[];
  color?: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  specification: Specification;
  category: string;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  images?: ProductImage[];
  color?: string;
  price?: number;
  discountedPrice?: number;
  stock?: number;
  specification?: Specification;
  category?: string;
}