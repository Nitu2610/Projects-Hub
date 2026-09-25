const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const createReviewValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required.")
    .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid product ID."),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required.")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required.")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Comment must be between 10 and 1000 characters."),
];

const updateReviewValidator = [
  param("reviewId")
    .notEmpty()
    .withMessage("Review ID is required.")
    .custom((value: string) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid review ID."),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5."),

  body("comment")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty.")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Comment must be between 10 and 1000 characters."),
];

module.exports = {
  createReviewValidator,
  updateReviewValidator,
};
