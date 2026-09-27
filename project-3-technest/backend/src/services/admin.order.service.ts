// import type { OrderStatus } from "../types/order.types";

// const Product = require("../models/product.model");
// const Order = require("../models/order.model");

// type OrderCancellationReason =
//   | "CHANGED_MIND"
//   | "ORDERED_BY_MISTAKE"
//   | "FOUND_BETTER_PRICE"
//   | "DELIVERY_DELAY"
//   | "OTHER";

// const allowedOrderStatusTransitions: Record<
//   OrderStatus,
//   OrderStatus[]
// > = {
//   PLACED: ["CONFIRMED", "CANCELLED"],
//   CONFIRMED: ["SHIPPED", "CANCELLED"],
//   SHIPPED: ["DELIVERED"],
//   DELIVERED: [],
//   CANCELLED: [],
// };

// const adminOrderService = {
//  getOrders: async (page: number = 1, limit: number = 10) => {
//   if (
//     !Number.isInteger(page) ||
//     !Number.isInteger(limit) ||
//     page < 1 ||
//     limit < 1
//   ) {
//     return {
//       success: false,
//       message: "Invalid pagination request.",
//       code: "INVALID_REQUEST",
//     };
//   }

//   const skip = (page - 1) * limit;

//   const [orders, total] = await Promise.all([
//     Order.find({})
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate("userId", "fullName"),

//     Order.countDocuments({}),
//   ]);

//   const totalPages = Math.ceil(total / limit);

//   return {
//     success: true,
//     message: "Orders fetched successfully.",
//     data: {
//       orders,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages,
//       },
//     },
//   };
// },

//   getOrderById: async (orderId: string) => {
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return {
//         success: false,
//         message: "Order not found.",
//         code: "NOT_FOUND",
//       };
//     }

//     return {
//       success: true,
//       message: "Order fetched successfully.",
//       data: order,
//     };
//   },

//   updateOrderStatus: async (
//     orderId: string,
//     orderStatus: OrderStatus
//   ) => {
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return {
//         success: false,
//         message: "Order not found.",
//         code: "NOT_FOUND",
//       };
//     }

//     const currentStatus: OrderStatus = order.orderStatus;

//     const allowedStatuses =
//       allowedOrderStatusTransitions[currentStatus];

//     if (!allowedStatuses.includes(orderStatus)) {
//       return {
//         success: false,
//         message: `Order cannot be changed from ${currentStatus} to ${orderStatus}.`,
//         code: "INVALID_STATUS_TRANSITION",
//       };
//     }

//     order.orderStatus = orderStatus;

//     await order.save();

//     return {
//       success: true,
//       message: "Order status updated successfully.",
//       data: order,
//     };
//   },

//   cancelOrder: async (
//     orderId: string,
//     cancellationReason: OrderCancellationReason
//   ) => {
//     const order = await Order.findById(orderId);

//     if (!order) {
//       return {
//         success: false,
//         message: "Order not found.",
//         code: "NOT_FOUND",
//       };
//     }

//     if (
//       order.orderStatus !== "PLACED" &&
//       order.orderStatus !== "CONFIRMED"
//     ) {
//       return {
//         success: false,
//         message: "Order cannot be cancelled at this stage.",
//         code: "CANCELLATION_NOT_ALLOWED",
//       };
//     }

//     for (const item of order.items) {
//       const product = await Product.findById(item.productId);

//       if (!product) {
//         return {
//           success: false,
//           message: `Product ${item.productName} no longer exists.`,
//           code: "PRODUCT_NOT_FOUND",
//         };
//       }

//       product.stock += item.quantity;

//       await product.save();
//     }

//     order.orderStatus = "CANCELLED";
//     order.cancellationReason = cancellationReason;
//     order.cancelledAt = new Date();

//     await order.save();

//     return {
//       success: true,
//       message: "Order cancelled successfully.",
//       data: order,
//     };
//   },
// };

// module.exports = adminOrderService;