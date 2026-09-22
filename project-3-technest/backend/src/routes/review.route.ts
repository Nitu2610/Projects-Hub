const express = require("express");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const {
  createReviewValidator,
  updateReviewValidator,
} = require("../validators/review.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const asyncHandler = require("../utils/asyncHandler");
const reviewController = require("../controllers/review.controller");

const reviewRouter = express.Router();

console.log(authorize)

reviewRouter.get("/product/:productId", 
  authMiddleware,
   authorize(["customer"]),
  asyncHandler(reviewController.getProductReviews));

reviewRouter.post(
  "/",
  authMiddleware,
  authorize(["customer"]),
  createReviewValidator,
  validatorMiddleware,
  asyncHandler(reviewController.createReview),
);

reviewRouter.patch(
  "/:reviewId",
  authMiddleware,
  authorize(["customer"]),
  updateReviewValidator,
  validatorMiddleware,
  asyncHandler(reviewController.updateReview),
);

reviewRouter.delete(
  "/:reviewId",
  authMiddleware,
  authorize(["customer"]),
  asyncHandler(reviewController.deleteReview),
);

module.exports= reviewRouter;
