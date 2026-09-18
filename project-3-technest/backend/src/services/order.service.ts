import { Types } from "mongoose";

const Address = require("../models/address.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");

interface createOrderRequestDataFormat {
  addressId: Types.ObjectId;
  paymentMethod: "COD" | "UPI" | "CARD";
  paymentData?: {
    upiId?: string;
    cardType: "CREDIT" | "DEBIT";
  };
}

interface CartItemDataFormat {
  productId: Types.ObjectId;
  quantity: number;
}

const orderService = {
  createOrder: async (
    basicOrderDetails: createOrderRequestDataFormat,
    userId: Types.ObjectId,
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
        message: "Cart is empty",
        code: "Cart_EMPTY",
      };
    }

    // map(async ...) returns Promise[].
    // Used Promise.all() before using the items.
    const products = await Promise.all(
      cart.items.map(async (cartItem:CartItemDataFormat) => {
        const product = await Product.findById(cartItem.productId);
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
            message: "Product quantity should be within stock",
            code: "INVALID_QUANTITY",
          };
        }

        const purchasedPrice = product.discountedPrice ?? product.price;

        const subtotal = cartItem.quantity * purchasedPrice;

        let productDetails = {
          productId: product._id,
          productName: product.title,
          quantity: cartItem.quantity,
          purchasedPrice: product.discountedPrice ?? product.price,
          subtotal,
        };

        return productDetails;
      }),
    );

    // Your map callback can return either an error object
    // or a product object. Therefore, you need to check
    // whether one of the product validations failed.
    const failedProduct = products.find(
      (item) => "success" in item && item.success === false,
    );

    if (failedProduct) {
      return failedProduct;
    }

    // After the validation above, TypeScript may still need
    // help narrowing the union in a stricter configuration.
    const items = products as {
      productId: Types.ObjectId;
      productName: string;
      quantity: number;
      purchasedPrice: number;
      subtotal: number;
    }[];

    const totalProductAmount = items.reduce(
      (total, item) => total + item.subtotal,
      0,
    );

    const shippingCharge =
      totalProductAmount <= 1000 ? 0 : totalProductAmount < 50000 ? 500 : 1000;

    const totalAmount = totalProductAmount + shippingCharge;

    // You previously wrote:
    // if (!basicOrderDetails.paymentData) return;
    //
    // That incorrectly rejects COD because paymentData
    // is not required for COD.
    //
    // Payment data is required only for UPI/CARD.
    if (
      basicOrderDetails.paymentMethod !== "COD" &&
      !basicOrderDetails.paymentData
    ) {
      return {
        success: false,
        message: "Payment data is required.",
        code: "INVALID_PAYMENT",
      };
    }

    let paymentStatus: "PENDING" | "PAID" | "FAILED";

    if (basicOrderDetails.paymentMethod === "COD") {
      paymentStatus = "PENDING";
    } else if (basicOrderDetails.paymentMethod === "UPI") {
      if (basicOrderDetails.paymentData?.upiId === "success@technest") {
        paymentStatus = "PAID";
      } else if (basicOrderDetails.paymentData?.upiId === "failed@technest") {
        paymentStatus = "FAILED";
      } else {
        return {
          success: false,
          message: "Incorrect payment details.",
          code: "INVALID_PAYMENT",
        };
      }
    } else if (basicOrderDetails.paymentMethod === "CARD") {
      if (
        basicOrderDetails.paymentData?.cardType === "CREDIT" ||
        basicOrderDetails.paymentData?.cardType === "DEBIT"
      ) {
        paymentStatus = "PAID";
      } else {
        return {
          success: false,
          message: "Incorrect payment details.",
          code: "INVALID_PAYMENT",
        };
      }
    } else {
      return {
        success: false,
        message: "Incorrect payment details.",
        code: "INVALID_PAYMENT",
      };
    }


    // This part was conceptually correct, but your original
    // success value was the string "false".
    //
    // success must be the boolean false.
    if (paymentStatus === "FAILED") {
      return {
        success: false,
        message: "Payment failed, cannot place the order.",
        code: "PAYMENT_FAILED",
      };
    }
    const orderStatus = "PLACED";

    let orderDetails = {
      userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod: basicOrderDetails.paymentMethod,
      paymentStatus,
      orderStatus,
    };

    // You don't need to search the cart again here.
    // `items` already contains the exact quantity that
    // must be deducted.
    //
    // Also, your previous code attempted:
    // const { stock: updateStock, ...rest } = product.ObjectId;
    //
    // That does not update product.stock.
    for (const productDetails of items) {
      const product = await Product.findById(productDetails.productId);

      if (!product) {
        return {
          success: false,
          message: "Product not found while updating stock.",
          code: "NOT_FOUND",
        };
      }

      product.stock = product.stock - productDetails.quantity;

      await product.save();
    }

    await Cart.findByIdAndUpdate(cart._id, {
      items: [],
    });

    const order = await Order.create(orderDetails);
    return {
      success: true,
      message: "Order created.",
      data: order,
    };
  },

    // Get all orders belonging to the logged-in customer
  getOrders: async (userId: Types.ObjectId) => {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    };
  },

  // Get one order belonging to the logged-in customer
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
  // 1. Validate order ID
  if (!Types.ObjectId.isValid(orderId)) {
    return {
      success: false,
      message: "Invalid order ID.",
      code: "INVALID_ORDER_ID",
    };
  }

  // 2. Find order belonging to the authenticated customer
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

  // 3. Check whether the current order status allows cancellation
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

  // 4. Restore stock for every ordered product
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

  // 5. Update order cancellation details
  order.orderStatus = "CANCELLED";
  order.cancellationReason = cancellationReason as
    | "CHANGED_MIND"
    | "ORDERED_BY_MISTAKE"
    | "FOUND_BETTER_PRICE"
    | "DELIVERY_DELAY"
    | "OTHER";

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
