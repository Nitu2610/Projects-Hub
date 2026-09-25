import mongoose, { Schema, Types } from "mongoose";

import type {
  CancellationReason,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  OrderItem,
  ShippingAddressSnapshot,
} from "../types/order.types";

interface OrderData {
  userId: Types.ObjectId;
  items: OrderItem[];
  shippingAddress: ShippingAddressSnapshot;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  cancellationReason?: CancellationReason;
  cancelledAt?: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
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
  {
    _id: false,
  }
);

const shippingAddressSchema =
  new Schema<ShippingAddressSnapshot>(
    {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        match: [
          /^[6-9]\d{9}$/,
          "Please provide a valid Indian mobile number",
        ],
      },

      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine2: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    }
  );

const orderSchema = new Schema<OrderData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: OrderItem[]) => items.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
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
      enum: [
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
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
  {
    timestamps: true,
  }
);

const Order = mongoose.model<OrderData>("Order", orderSchema);

module.exports = Order;