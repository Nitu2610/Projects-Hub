import type { CartItem } from "../types/cart.types";

const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

const cartService = {
  addToCart: async (
    productId: string,
    quantity: number,
    userId: string
  ) => {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
        code: "NOT_FOUND",
      };
    }

    if (!product.active) {
      return {
        success: false,
        message: "Product is inactive.",
        code: "PRODUCT_INACTIVE",
      };
    }

    if (quantity > product.stock) {
      return {
        success: false,
        message: "Product quantity should be within stock.",
        code: "INVALID_QUANTITY",
      };
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const createdCart = await Cart.create({
        userId,
        items: [
          {
            productId,
            quantity,
          },
        ],
      });

      return {
        success: true,
        message: "Product added to cart.",
        data: createdCart,
      };
    }

    const existingCartItem = cart.items.find(
      (item: CartItem) =>
        item.productId.toString() === productId
    );

    if (!existingCartItem) {
      cart.items.push({
        productId,
        quantity,
      });
    } else {
      existingCartItem.quantity = quantity;
    }

    const updatedCart = await cart.save();

    return {
      success: true,
      message: existingCartItem
        ? "Product quantity updated."
        : "Product added to cart.",
      data: updatedCart,
    };
  },

  getCart: async (userId: string) => {
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId"
    );

    if (!cart) {
      return {
        success: true,
        message: "Cart is empty.",
        data: {
          userId,
          items: [],
        },
      };
    }

    return {
      success: true,
      message: "Cart fetched successfully.",
      data: cart,
    };
  },

  updateCartItem: async (
    productId: string,
    quantity: number,
    userId: string
  ) => {
    const product = await Product.findById(productId);

    if (!product) {
      return {
        success: false,
        message: "Product not found.",
        code: "NOT_FOUND",
      };
    }

    if (!product.active) {
      return {
        success: false,
        message: "Product is inactive, can't update cart.",
        code: "PRODUCT_INACTIVE",
      };
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return {
        success: false,
        message: "Cart item not found.",
        code: "CART_ITEM_NOT_FOUND",
      };
    }

    const itemIndex = cart.items.findIndex(
      (item: CartItem) =>
        item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return {
        success: false,
        message: "Cart item not found.",
        code: "CART_ITEM_NOT_FOUND",
      };
    }

    if (quantity > product.stock) {
      return {
        success: false,
        message: "Invalid quantity.",
        code: "INVALID_QUANTITY",
      };
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);

      const updatedCart = await cart.save();

      return {
        success: true,
        message: "Product removed from cart.",
        data: updatedCart,
      };
    }

    cart.items[itemIndex].quantity = quantity;

    const updatedCart = await cart.save();

    return {
      success: true,
      message: "Cart quantity updated successfully.",
      data: updatedCart,
    };
  },

  deleteCartItem: async (
    productId: string,
    userId: string
  ) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return {
        success: false,
        message: "Cart item not found.",
        code: "CART_ITEM_NOT_FOUND",
      };
    }

    const itemIndex = cart.items.findIndex(
      (item: CartItem) =>
        item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return {
        success: false,
        message: "Cart item not found.",
        code: "CART_ITEM_NOT_FOUND",
      };
    }

    cart.items.splice(itemIndex, 1);

    const updatedCart = await cart.save();

    return {
      success: true,
      message: "Product removed from cart.",
      data: updatedCart,
    };
  },

  clearCart: async (userId: string) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return {
        success: true,
        message: "Cart is already empty.",
        data: {
          userId,
          items: [],
        },
      };
    }

    cart.items = [];

    const clearedCart = await cart.save();

    return {
      success: true,
      message: "Cart cleared successfully.",
      data: clearedCart,
    };
  },
};

module.exports = cartService;