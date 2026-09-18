import { Request, Response } from "express";

const orderService = require("../services/order.service");

const orderController = {
  createOrder: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const orderDetails = req.body;

    const response = await orderService.createOrder(orderDetails, userId);

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
      if (
        response.code === "INVALID_PAYMENT" ||
        response.code === "PAYMENT_FAILED" ||
        response.code === "INACTIVE_PRODUCT" ||
        response.code === "INVALID_QUANTITY"
      ) {
        return res.status(400).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(201).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  getOrders: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const response = await orderService.getOrders(userId);

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  getOrderById: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { orderId } = req.params;

    const response = await orderService.getOrderById(orderId, userId);

    if (!response.success) {
      if (response.code === "INVALID_ORDER_ID") {
        return res.status(400).json({
          success: response.success,
          message: response.message,
        });
      }

      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: response.success,
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
    if (response.code === "INVALID_ORDER_ID") {
      return res.status(400).json({
        success: response.success,
        message: response.message,
      });
    }

    if (
      response.code === "CANCELLATION_NOT_ALLOWED" ||
      response.code === "PRODUCT_NOT_FOUND"
    ) {
      return res.status(400).json({
        success: response.success,
        message: response.message,
      });
    }

    if (response.code === "NOT_FOUND") {
      return res.status(404).json({
        success: response.success,
        message: response.message,
      });
    }
  }

  return res.status(200).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
},

};

module.exports = orderController;
