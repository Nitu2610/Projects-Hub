const Review = require("../models/review.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
import mongoose from "mongoose";

const reviewService = {
  createReview: async (
    userId: string,
    productId: string,
    rating: number,
    comment: string
  ) => {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
        code: "NOT_FOUND",
      };
    }

    const deliveredOrder = await Order.findOne({
      userId,
      orderStatus: "DELIVERED",
      "items.productId": productId,
    });

    if (!deliveredOrder) {
      return {
        success: false,
        message:
          "You can review this product only after receiving it.",
        code: "ORDER_NOT_DELIVERED",
      };
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: new mongoose.Types.ObjectId(productId),
    });

    if (existingReview) {
      return {
        success: false,
        message: "You have already reviewed this product.",
        code: "ALREADY_REVIEWED",
      };
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    return {
      success: true,
      message: "Review created successfully.",
      data: review,
    };
  },

  getProductReviews: async (
    userId: string,
    productId: string
  ) => {
    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    const ratingSummary = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

    let canReview = false;

    if (userId) {
      const deliveredOrder = await Order.findOne({
        userId,
        orderStatus: "DELIVERED",
        "items.productId": productId,
      });

      if (deliveredOrder) {
        const existingReview = await Review.findOne({
          user: userId,
          product: productId,
        });

        canReview = !existingReview;
      }
    }

    return {
      success: true,
      message: "Reviews fetched successfully.",
      data: {
        reviews,
        averageRating:
          ratingSummary[0]?.averageRating ?? 0,
        reviewCount:
          ratingSummary[0]?.reviewCount ?? 0,
        canReview,
      },
    };
  },

  updateReview: async (
    userId: string,
    reviewId: string,
    rating?: number,
    comment?: string
  ) => {
    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return {
        success: false,
        message: "Review not found.",
        code: "NOT_FOUND",
      };
    }

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    return {
      success: true,
      message: "Review updated successfully.",
      data: review,
    };
  },

  deleteReview: async (
    userId: string,
    reviewId: string
  ) => {
    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return {
        success: false,
        message: "Review not found",
        code: "NOT_FOUND",
      };
    }

    return {
      success: true,
      message: "Review deleted successfully.",
    };
  },

  // ADMIN
  getAllReviews: async () => {
    const reviews = await Review.find()
      .populate("user", "fullName email")
      .populate("product", "title")
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: "Reviews fetched successfully.",
      data: reviews,
    };
  },
};

module.exports = reviewService;