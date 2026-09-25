import mongoose, { Schema, Types } from "mongoose";

export interface Category {
  name: string;
  normalizedName: string;
  parent: Types.ObjectId | null;
  active: boolean;
}

const categorySchema = new Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    normalizedName: {
      type: String,
      required: true,
      trim: true,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index(
  {
    parent: 1,
    normalizedName: 1,
  },
  {
    unique: true,
  }
);

const Category = mongoose.model<Category>(
  "Category",
  categorySchema
);

module.exports = Category;