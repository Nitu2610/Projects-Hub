import { Request, response, Response } from "express";
const reviewService = require("../services/review.service");

const reviewController = {
  createReview: async (req: Request, res: Response) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user.userId;

    const response = await reviewService.createReview(
      userId,
      productId,
      rating,
      comment,
    );

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
      if (
        response.code === "ORDER_NOT_DELIVERED" ||
        response.code === "ALREADY_REVIEWED"
      ) {
        return res.status(409).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    res.status(201).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  getProductReviews: async (req: Request, res: Response) => {
    const userId=req.user.userId;
    const { productId } = req.params;
    const response = await reviewService.getProductReviews(userId,productId);

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
      if (
        response.code === "ORDER_NOT_DELIVERED" ||
        response.code === "ALREADY_REVIEWED"
      ) {
        return res.status(409).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  updateReview: async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const response = await reviewService.updateReview(
      userId,
      reviewId,
      rating,
      comment,
    );

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  deleteReview: async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const response = await reviewService.deleteReview(userId, reviewId);

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    res.status(200).json({
      success: response.success,
      message: response.message,
    });
  },
};

module.exports = reviewController;




