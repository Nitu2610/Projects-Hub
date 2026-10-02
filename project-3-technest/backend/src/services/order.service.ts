import { Types } from "mongoose";
import type {
  CreateOrderData,
  PaymentMethod,
  PaymentStatus,
  OrderStatus,
  CancellationReason,
  AdminCancellationReason,
} from "../types/order.types";

const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Adddress = require("../models/address.model");

const allowedOrderStatusTransitions: Record<
  OrderStatus,
  OrderStatus[]
> = {
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const calculateShippingCharge = (subtotal: number) => {
  if (subtotal <= 1000) return 0;
  if (subtotal < 50000) return 500;
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
  // -------------------------
  // Customer operations
  // -------------------------

 createOrder: async (
  basicOrderDetails: CreateOrderData,
  userId: Types.ObjectId
) => {
  // 1. Get user's cart
  const cart = await Cart.findOne({ userId });

  // 2. Cart must exist and contain items
  if (!cart || cart.items.length === 0) {
    return {
      success: false,
      message: "Cart is empty.",
      code: "CART_EMPTY",
    };
  }

  // 3. Check shipping address
  // The address must belong to the logged-in user
  const shippingAddress = await Adddress.findOne({
    _id: basicOrderDetails.addressId,
    userId,
  });

  if (!shippingAddress) {
    return {
      success: false,
      message: "Shipping address doesn't exist.",
      code: "ADDRESS_NOT_FOUND",
    };
  }

  // 4. Validate payment and determine payment status
  const { paymentMethod, paymentData } = basicOrderDetails;

  const paymentResponse = getPaymentStatus(
    paymentMethod,
    paymentData
  );

  if (!paymentResponse.success) {
    return {
      success: false,
      message: paymentResponse.message,
      code: paymentResponse.code,
    };
  }

  // 5. Build order items
  const orderItems = [];

  for (const cartItem of cart.items) {
    // Get latest product data from database
    const product = await Product.findById(cartItem.productId);

    // Product no longer exists
    if (!product) {
      return {
        success: false,
        message: "Product doesn't exist.",
        code: "NOT_FOUND",
      };
    }

    // Check current stock
    if (product.stock < cartItem.quantity) {
      return {
        success: false,
        message: `Insufficient stock for ${product.name}.`,
        code: "INVALID_QUANTITY",
      };
    }

    // Calculate item subtotal using DB price
    const itemSubtotal =
      product.price * cartItem.quantity;

    orderItems.push({
       productId: product._id,
  productName: product.title,
  quantity: cartItem.quantity,
  purchasedPrice: product.price,
  subtotal: itemSubtotal,
    });
  }

  // 6. Calculate order subtotal
  const subtotal = orderItems.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  // 7. Calculate shipping charge
  const shippingFee = calculateShippingCharge(subtotal);

  // 8. Calculate final order amount
  const totalAmount = subtotal + shippingFee;

  // 9. Create order
  const order = await Order.create({
    userId,

    items: orderItems,

    shippingAddress: {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
    },

    subtotal,
    shippingFee,
    totalAmount,

    paymentMethod,
    paymentStatus: paymentResponse.paymentStatus,

    orderStatus: "PLACED",
  });

  // 10. Reduce product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      item.productId,
      {
        $inc: {
          stock: -item.quantity,
        },
      }
    );
  }

  // 11. Clear cart
  cart.items = [];
  await cart.save();

  // 12. Return created order
  return {
    success: true,
    message: "Order created successfully.",
    data: order,
  };
},

  getOrders: async (userId: Types.ObjectId) => {
    const orders = await Order.find({ userId }).sort({
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
  userId: Types.ObjectId | undefined,
  cancellationReason: CancellationReason
) => {
  console.log("Request reached service /-----------------------/");
  // Check order id is valid or not. 
  // if (!Types.ObjectId.isValid(orderId)) {
  //   return {
  //     success: false,
  //     message: "Invalid order ID.",
  //     code: "INVALID_ORDER_ID",
  //   };
  // }

  // an order object query. 
  const orderQuery: Record<string, unknown> = {
    _id: orderId,
  };

  if (userId) {
    orderQuery.userId = userId;
  }

  const order = await Order.findOne(orderQuery);

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

  // check product and update the stock - then save.
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

  // -------------------------
  // Admin operations
  // -------------------------

  getAllOrders: async (
    page: number = 1,
    limit: number = 10
  ) => {
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return {
        success: false,
        message: "Invalid pagination request.",
        code: "INVALID_REQUEST",
      };
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "fullName"),

      Order.countDocuments({}),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: "Orders fetched successfully.",
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  },

  getAdminOrderById: async (orderId: string) => {
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
    const order = await Order.findById(orderId);

    if (!order) {
      return {
        success: false,
        message: "Order not found.",
        code: "NOT_FOUND",
      };
    }

    const currentStatus: OrderStatus = order.orderStatus;

    const allowedStatuses =
      allowedOrderStatusTransitions[currentStatus];

    if (!allowedStatuses.includes(orderStatus)) {
      return {
        success: false,
        message: `Order cannot be changed from ${currentStatus} to ${orderStatus}.`,
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

  cancelAdminOrder: async (
  orderId: string,
  cancellationReason: AdminCancellationReason
) => {
//  console.log("Request reached service /-----------------------/")
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

  console.log(cancellationReason);
  order.orderStatus = "CANCELLED";
  order.cancellationReason = cancellationReason;
  order.cancelledAt = new Date();

  await order.save();

  return {
    success: true,
    message: "Order cancelled successfully by admin.",
    data: order,
  };
},
};

module.exports = orderService;