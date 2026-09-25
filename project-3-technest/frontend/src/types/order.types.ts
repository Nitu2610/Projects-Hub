export type PaymentMethod = "COD" | "UPI" | "CARD";

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

export interface OrderItem {
  productId: string;
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

interface UserIdDataFormat{
  _id:string;
  fullName:string;
  email:string;
}
export interface Order {
  _id: string ;
  userId: UserIdDataFormat;
  items: OrderItem[];
  shippingAddress: ShippingAddressSnapshot;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  cancellationReason?: CancellationReason;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}


export interface PaymentData {
  upiId?: string;
  cardType?: "CREDIT" | "DEBIT";
}

export interface CreateOrderRequest {
  addressId: string;
  paymentMethod: PaymentMethod;
  paymentData?: PaymentData;
}

export interface CancelOrderRequest {
  orderId: string;
  cancellationReason: CancellationReason;
}



export interface UpdateOrderStatusRequest {
  orderId: string;
  orderStatus: OrderStatus;
}

export interface AdminCancelOrderRequest {
  orderId: string;
  cancellationReason: CancellationReason;
}