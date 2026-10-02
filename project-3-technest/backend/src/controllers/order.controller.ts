import type { Request, Response } from "express";

const orderService = require("../services/order.service");

const orderController = {
  // =========================
  // Customer
  // =========================

createOrder: async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const response = await orderService.createOrder(
    req.body,
    userId
  );

  if (!response.success) {
    if (
      response.code === "NOT_FOUND" ||
      response.code === "ADDRESS_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: response.message,
      });
    }

    if (
      response.code === "CART_EMPTY" ||
      response.code === "INVALID_QUANTITY" ||
      response.code === "INVALID_PAYMENT" ||
      response.code === "PAYMENT_FAILED"
    ) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: response.message,
    });
  }

  return res.status(201).json({
    success: true,
    message: response.message,
    data: response.data,
  });
},

  getOrders: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const response = await orderService.getOrders(userId);

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  getOrderById: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { orderId } = req.params;

    const response = await orderService.getOrderById(
      orderId,
      userId
    );

    if (!response.success) {
      if (response.code === "INVALID_ORDER_ID") {
        return res.status(400).json({
          success: false,
          message: response.message,
        });
      }

      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  cancelOrder: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    const response = await orderService.cancelOrder(
      orderId,
      userId,
      cancellationReason
    );

    if (!response.success) {
      if (
        response.code === "INVALID_ORDER_ID" ||
        response.code === "CANCELLATION_NOT_ALLOWED" ||
        response.code === "PRODUCT_NOT_FOUND"
      ) {
        return res.status(400).json({
          success: false,
          message: response.message,
        });
      }

      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  // =========================
  // Admin
  // =========================

  getAllOrders: async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const response = await orderService.getAllOrders(
      page,
      limit
    );

    if (!response.success) {
      if (response.code === "INVALID_REQUEST") {
        return res.status(400).json({
          success: false,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  getAdminOrderById: async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const response = await orderService.getAdminOrderById(
      orderId
    );

    if (!response.success) {
      if (response.code === "INVALID_ORDER_ID") {
        return res.status(400).json({
          success: false,
          message: response.message,
        });
      }

      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const response = await orderService.updateOrderStatus(
      orderId,
      orderStatus
    );

    if (!response.success) {
      if (response.code === "INVALID_ORDER_ID") {
        return res.status(400).json({
          success: false,
          message: response.message,
        });
      }

      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }

      if (response.code === "INVALID_STATUS_TRANSITION") {
        return res.status(400).json({
          success: false,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

cancelAdminOrder: async (req: Request, res: Response) => {
  console.log("🔥 ADMIN CANCEL CONTROLLER REACHED");
  const { orderId } = req.params;
  const { adminCancellationReasons :  cancellationReason } = req.body;

  const response = await orderService.cancelAdminOrder(
    orderId,
    cancellationReason
  );

  if (!response.success) {
    if (response.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: response.message,
      });
    }

    if (
      response.code === "CANCELLATION_NOT_ALLOWED" ||
      response.code === "PRODUCT_NOT_FOUND"
    ) {
      return res.status(400).json({
        success: false,
        message: response.message,
      });
    }
  }

  return res.status(200).json({
    success: true,
    message: response.message,
    data: response.data,
  });
},
};

module.exports = orderController;