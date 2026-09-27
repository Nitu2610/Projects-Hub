const express = require("express");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const asyncHandler = require("../utils/asyncHandler");
const optionalAuthenticationMiddleware = require("../middlewares/optionalAuthentication.middleware");
const {
  createReviewValidator,
  updateReviewValidator,
  productIdParamValidator
} = require("../validators/review.validator");

const reviewController = require("../controllers/review.controller");

const reviewRouter = express.Router();

// Admin
reviewRouter.get(
  "/admin",
  authMiddleware,
  authorize("admin"),
  asyncHandler(reviewController.getAllReviews)
);

reviewRouter.delete(
  "/:reviewId",
  authMiddleware,
  authorize("admin"),
  asyncHandler(reviewController.deleteReview)
);

// Public
reviewRouter.get(
  "/product/:productId",
  optionalAuthenticationMiddleware,
  productIdParamValidator,
  validatorMiddleware,
  asyncHandler(reviewController.getProductReviews)
);

// Customer
reviewRouter.post(
  "/",
  authMiddleware,
  authorize("customer"),
  createReviewValidator,
  validatorMiddleware,
  asyncHandler(reviewController.createReview)
);

// Existing customer update functionality
reviewRouter.patch(
  "/:reviewId",
  authMiddleware,
  authorize("customer"),
  updateReviewValidator,
  validatorMiddleware,
  asyncHandler(reviewController.updateReview)
);

module.exports = reviewRouter;