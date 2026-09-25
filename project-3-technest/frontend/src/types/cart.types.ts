export interface CartProduct {
  _id: string;
  title: string;
  image?: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  active: boolean;
}

export interface CartItem {
  productId: CartProduct;
  quantity: number;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}