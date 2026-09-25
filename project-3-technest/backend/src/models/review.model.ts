import mongoose, { Schema, Types } from "mongoose";

export interface Review {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<Review>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true }
);

const Review = mongoose.model<Review>("Review", reviewSchema);

module.exports = Review;