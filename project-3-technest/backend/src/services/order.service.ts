import { Types } from "mongoose";

import type {
  CreateOrderData,
  OrderItem,
  PaymentMethod,
  PaymentStatus,
} from "../types/order.types";

const Address = require("../models/address.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");

const calculateShippingCharge = (subtotal: number) => {
  if (subtotal <= 1000) {
    return 0;
  }

  if (subtotal < 50000) {
    return 500;
  }

  return 1000;
};

const getPaymentStatus = (
  paymentMethod: PaymentMethod,
  paymentData?: CreateOrderData["paymentData"]
): {
  success: boolean;
  paymentStatus?: PaymentStatus;
  message?: string;
  code?: string;
} => {
  if (paymentMethod === "COD") {
    return {
      success: true,
      paymentStatus: "PENDING",
    };
  }

  if (!paymentData) {
    return {
      success: false,
      message: "Payment data is required.",
      code: "INVALID_PAYMENT",
    };
  }

  if (paymentMethod === "UPI") {
    if (paymentData.upiId === "success@technest") {
      return {
        success: true,
        paymentStatus: "PAID",
      };
    }

    if (paymentData.upiId === "failed@technest") {
      return {
        success: true,
        paymentStatus: "FAILED",
      };
    }

    return {
      success: false,
      message: "Incorrect payment details.",
      code: "INVALID_PAYMENT",
    };
  }

  if (paymentMethod === "CARD") {
    if (
      paymentData.cardType === "CREDIT" ||
      paymentData.cardType === "DEBIT"
    ) {
      return {
        success: true,
        paymentStatus: "PAID",
      };
    }

    return {
      success: false,
      message: "Incorrect payment details.",
      code: "INVALID_PAYMENT",
    };
  }

  return {
    success: false,
    message: "Incorrect payment details.",
    code: "INVALID_PAYMENT",
  };
};

const orderService = {
  createOrder: async (
    basicOrderDetails: CreateOrderData,
    userId: Types.ObjectId
  ) => {
    const address = await Address.findOne({
      _id: basicOrderDetails.addressId,
      userId,
    });

    if (!address) {
      return {
        success: false,
        message: "Address not found.",
        code: "NOT_FOUND",
      };
    }

    const shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return {
        success: false,
        message: "Cart not found.",
        code: "NOT_FOUND",
      };
    }

    if (cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty.",
        code: "CART_EMPTY",
      };
    }

    const items: OrderItem[] = [];

    for (const cartItem of cart.items) {
      const product = await Product.findById(
        cartItem.productId
      );

      if (!product) {
        return {
          success: false,
          message: "Product not found.",
          code: "NOT_FOUND",
        };
      }

      if (!product.active) {
        return {
          success: false,
          message: "Product not active.",
          code: "INACTIVE_PRODUCT",
        };
      }

      if (cartItem.quantity > product.stock) {
        return {
          success: false,
          message: "Product quantity should be within stock.",
          code: "INVALID_QUANTITY",
        };
      }

      const purchasedPrice =
        product.discountedPrice ?? product.price;

      const subtotal =
        cartItem.quantity * purchasedPrice;

      items.push({
        productId: product._id,
        productName: product.title,
        quantity: cartItem.quantity,
        purchasedPrice,
        subtotal,
      });
    }

    const totalProductAmount = items.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    const shippingCharge =
      calculateShippingCharge(totalProductAmount);

    const totalAmount =
      totalProductAmount + shippingCharge;

    const paymentResult = getPaymentStatus(
      basicOrderDetails.paymentMethod,
      basicOrderDetails.paymentData
    );

    if (!paymentResult.success) {
      return paymentResult;
    }

    if (paymentResult.paymentStatus === "FAILED") {
      return {
        success: false,
        message: "Payment failed, cannot place the order.",
        code: "PAYMENT_FAILED",
      };
    }

    const orderStatus = "PLACED";

    const orderDetails = {
      userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: basicOrderDetails.paymentMethod,
      paymentStatus: paymentResult.paymentStatus,
      orderStatus,
    };

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return {
          success: false,
          message: "Product not found while updating stock.",
          code: "NOT_FOUND",
        };
      }

      product.stock -= item.quantity;

      await product.save();
    }

    await Cart.findByIdAndUpdate(cart._id, {
      items: [],
    });

    const order = await Order.create(orderDetails);

    return {
      success: true,
      message: "Order created successfully.",
      data: order,
    };
  },

  getOrders: async (userId: Types.ObjectId) => {
    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return {
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    };
  },

  getOrderById: async (
    orderId: string,
    userId: Types.ObjectId
  ) => {
    if (!Types.ObjectId.isValid(orderId)) {
      return {
        success: false,
        message: "Invalid order ID.",
        code: "INVALID_ORDER_ID",
      };
    }

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

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

  cancelOrder: async (
    orderId: string,
    userId: Types.ObjectId,
    cancellationReason: string
  ) => {
    if (!Types.ObjectId.isValid(orderId)) {
      return {
        success: false,
        message: "Invalid order ID.",
        code: "INVALID_ORDER_ID",
      };
    }

    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found.",
        code: "NOT_FOUND",
      };
    }

    if (
      order.orderStatus !== "PLACED" &&
      order.orderStatus !== "CONFIRMED"
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

module.exports = orderService;