import mongoose, { Types, Schema } from "mongoose";

interface CartDataFormat {
  userId: Types.ObjectId;
  items: [
    {
      propertyId: Types.ObjectId;
      quantity: number;
    },
  ];
}

const cartSchema = new mongoose.Schema<CartDataFormat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: {
          type: Number,
          min: 1,
          require: true,
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
