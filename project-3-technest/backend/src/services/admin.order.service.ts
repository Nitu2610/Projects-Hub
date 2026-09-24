import { Types } from "mongoose";
import { OrderStatus } from "../models/order.model";

const Address = require("../models/address.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");


  interface Order {
  orderStatus: OrderStatus;
}
 type OrderCancellationReason= 
    | "CHANGED_MIND"
    | "ORDERED_BY_MISTAKE"
    | "FOUND_BETTER_PRICE"
    | "DELIVERY_DELAY"
    | "OTHER";

const allowedOrderStatusTransitions: Record<
  OrderStatus,
  OrderStatus[]
> = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

const adminOrderService = {

  getOrders: async () => {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("userId", "fullName");

    return {
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    };
  },

  getOrderById: async (orderId: string) => {
    if (!Types.ObjectId.isValid(orderId)) {
      return {
        success: false,
        message: "Invalid order ID.",
        code: "INVALID_ORDER_ID",
      };
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return {
        success: false,
        message: "Order not found.",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Order fetched successfully.",
      data: order,
    };
  },

  updateOrderStatus: async (
  orderId: string,
  orderStatus: OrderStatus
) => {
  if (!Types.ObjectId.isValid(orderId)) {
    return {
      success: false,
      message: "Invalid order ID.",
      code: "INVALID_ORDER_ID",
    };
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return {
      success: false,
      message: "Order not found.",
      code: "NOT_FOUND",
    };
  } 
const requestOrderStatus : OrderStatus= order.orderStatus;

  const allowedStatuses=
    allowedOrderStatusTransitions[requestOrderStatus] ;

  if (!allowedStatuses.includes(orderStatus)) {
    return {
      success: false,
      message: `Order cannot be changed from ${order.orderStatus} to ${orderStatus}.`,
      code: "INVALID_STATUS_TRANSITION",
    };
  }

  order.orderStatus = orderStatus;

  await order.save();

  return {
    success: true,
    message: "Order status updated successfully.",
    data: order,
  };
},

cancelOrder: async (
  orderId: string,
  cancellationReason: OrderCancellationReason
) => {
  if (!Types.ObjectId.isValid(orderId)) {
    return {
      success: false,
      message: "Invalid order ID.",
      code: "INVALID_ORDER_ID",
    };
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return {
      success: false,
      message: "Order not found.",
      code: "NOT_FOUND",
    };
  }

  if (
    order.orderStatus !== "PLACED" &&
    order.orderStatus !== "CONFIRMED" &&
    order.orderStatus !== "SHIPPED"
  ) {
    return {
      success: false,
      message: "Order cannot be cancelled at this stage.",
      code: "CANCELLATION_NOT_ALLOWED",
    };
  }

  for (const item of order.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return {
        success: false,
        message: `Product ${item.productName} no longer exists.`,
        code: "PRODUCT_NOT_FOUND",
      };
    }

    product.stock += item.quantity;
    await product.save();
  }

  order.orderStatus = "CANCELLED";
  order.cancellationReason = cancellationReason;
  order.cancelledAt = new Date();

  await order.save();

  return {
    success: true,
    message: "Order cancelled successfully.",
    data: order,
  };
},

};

module.exports = adminOrderService;
