import type { Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface CartData {
  userId: Types.ObjectId;
  items: CartItem[];
}

export interface CartItemResponse {
  productId: Types.ObjectId;
  quantity: number;
}