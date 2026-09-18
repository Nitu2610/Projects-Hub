import mongoose, { Types, Schema } from "mongoose";

interface CartDataFormat {
  userId: Types.ObjectId;
  items: [
    {
      productId: Types.ObjectId;
      quantity: number;
    },
  ];
}

const cartSchema = new mongoose.Schema<CartDataFormat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
