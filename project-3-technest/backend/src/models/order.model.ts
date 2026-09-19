import mongoose, { Schema, Types } from "mongoose";

interface OrderItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  purchasedPrice: number;
  subtotal: number;
}

interface ShippingAddressSnapshot {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

  
interface OrderDataFormat {
  userId: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddressSnapshot;
  totalAmount: number;
  paymentMethod: "COD" | "UPI" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus:OrderStatus;
  cancellationReason?:
    | "CHANGED_MIND"
    | "ORDERED_BY_MISTAKE"
    | "FOUND_BETTER_PRICE"
    | "DELIVERY_DELAY"
    | "OTHER";

  cancelledAt?: Date;
}

const orderSchema = new mongoose.Schema<OrderDataFormat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        purchasedPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: [/^[6-9]\d{9}$/, "Please provide a valid Indian mobile number"],
      },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      required: true,
    },

    orderStatus: {
      type: String,
      enum: ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      required: true,
    },
    cancellationReason: {
      type: String,
      enum: [
        "CHANGED_MIND",
        "ORDERED_BY_MISTAKE",
        "FOUND_BETTER_PRICE",
        "DELIVERY_DELAY",
        "OTHER",
      ],
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model<OrderDataFormat>("Order", orderSchema);

module.exports = Order;
