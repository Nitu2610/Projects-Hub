import type { Request, Response } from "express";

const adminOrderService = require("../services/admin.order.service");

const adminOrderController = {
  getOrders: async (req: Request, res: Response) => {
    const response = await adminOrderService.getOrders();

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  getOrderById: async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const response =
      await adminOrderService.getOrderById(orderId);

    if (!response.success) {
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

  updateOrderStatus: async (
    req: Request,
    res: Response
  ) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const response =
      await adminOrderService.updateOrderStatus(
        orderId,
        orderStatus
      );

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }

      if (
        response.code === "INVALID_STATUS_TRANSITION"
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

  cancelOrder: async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { cancellationReason } = req.body;

    const response =
      await adminOrderService.cancelOrder(
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

module.exports = adminOrderController;