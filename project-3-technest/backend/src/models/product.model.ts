import mongoose, { Schema, Types } from "mongoose";

interface Specification {
  [key: string]: string;
}
interface ProductImage {
  url: string;
  publicId: string;
}

interface Product {
  title: string;
  description: string;
  image?: string;
  color?: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  specification: Specification;
  category: Types.ObjectId;
  active: boolean;
  images: ProductImage[];
}

const productImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema<Product>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },

    color: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0.01,
    },

    discountedPrice: {
      type: Number,
      min: 0.01,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    specification: {
      type: Map,
      of: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Product = mongoose.model<Product>("Product", productSchema);

module.exports = Product;
