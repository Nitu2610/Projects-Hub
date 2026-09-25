import type { Request, Response } from "express";

const cartService = require("../services/cart.service");

const cartController = {
  addToCart: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    const response = await cartService.addToCart(
      productId,
      quantity,
      userId
    );

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }

      if (
        response.code === "PRODUCT_INACTIVE" ||
        response.code === "INVALID_QUANTITY"
      ) {
        return res.status(409).json({
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

  getCart: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const response = await cartService.getCart(userId);

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  updateCartItem: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    const response = await cartService.updateCartItem(
      productId,
      quantity,
      userId
    );

    if (!response.success) {
      if (
        response.code === "NOT_FOUND" ||
        response.code === "CART_ITEM_NOT_FOUND"
      ) {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }

      if (
        response.code === "PRODUCT_INACTIVE" ||
        response.code === "INVALID_QUANTITY"
      ) {
        return res.status(409).json({
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

  deleteCartItem: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    const response = await cartService.deleteCartItem(
      productId,
      userId
    );

    if (
      !response.success &&
      response.code === "CART_ITEM_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  clearCart: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const response = await cartService.clearCart(userId);

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },
};

module.exports = cartController;