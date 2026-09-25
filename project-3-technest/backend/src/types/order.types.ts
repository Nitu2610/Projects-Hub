import type { Types } from "mongoose";

export type PaymentMethod = "COD" | "UPI" | "CARD";

export type CardType = "CREDIT" | "DEBIT";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type CancellationReason =
  | "CHANGED_MIND"
  | "ORDERED_BY_MISTAKE"
  | "FOUND_BETTER_PRICE"
  | "DELIVERY_DELAY"
  | "OTHER";

export interface PaymentData {
  upiId?: string;
  cardType?: CardType;
}

export interface CreateOrderData {
  addressId: Types.ObjectId;
  paymentMethod: PaymentMethod;
  paymentData?: PaymentData;
}

export interface CartItemData {
  productId: Types.ObjectId;
  quantity: number;
}

export interface OrderItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  purchasedPrice: number;
  subtotal: number;
}

export interface ShippingAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}