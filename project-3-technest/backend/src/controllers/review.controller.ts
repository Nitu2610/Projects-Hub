import { Request, Response } from "express";

const reviewService = require("../services/review.service");

const reviewController = {
  createReview: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const response = await reviewService.createReview(
      userId,
      {
        productId: req.body.productId,
        rating: req.body.rating,
        comment: req.body.comment,
      }
    );

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: response.message,
        });
      }

      if (
        response.code === "ORDER_NOT_DELIVERED" ||
        response.code === "ALREADY_REVIEWED"
      ) {
        return res.status(409).json({
          success: false,
          message: response.message,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  getProductReviews: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    const response = await reviewService.getProductReviews(
      userId,
      productId
    );

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },

  updateReview: async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const response = await reviewService.updateReview(
      userId,
      reviewId,
      {
        rating: req.body.rating,
        comment: req.body.comment,
      }
    );

    if (!response.success && response.code === "NOT_FOUND") {
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

  deleteReview: async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const response = await reviewService.deleteReview(
      userId,
      reviewId
    );

    if (!response.success && response.code === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: response.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: response.message,
    });
  },

  getAllReviews: async (req: Request, res: Response) => {
    const response = await reviewService.getAllReviews();

    return res.status(200).json({
      success: true,
      message: response.message,
      data: response.data,
    });
  },
};

module.exports = reviewController;