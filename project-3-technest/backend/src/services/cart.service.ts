import mongoose,{Types} from "mongoose";

const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

interface CartItemDataFormat {
  productId: Types.ObjectId;
  quantity: number;
}

const cartService = {

addToCart: async ( productId: Types.ObjectId,
  quantity: number, userId: Types.ObjectId) => {

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
      message: "Product quantity should be within stock",
      code: "INVALID_QUANTITY",
    };
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    const newCart = {
      userId,
      items: [{productId, quantity}],
    };

    const createdCart = await Cart.create(newCart);

    return {
      success: true,
      message: "Product added to cart",
      data: createdCart,
    };
  }

  // If the product already exists in the cart, update its quantity.
  const existingCartItem = cart.items.find(
    (item: CartItemDataFormat) =>
      item.productId.toString() === productId.toString(),
  );

  if (!existingCartItem) {
    cart.items.push({productId,quantity});
  } else {
    existingCartItem.quantity = quantity;
  }
// Mongoose retrieves the MongoDB document and gives you a Mongoose document instance representing that same database document, on which you perform the modification and use .save() on the same data, so its automatically update the  data/doc on the mongoDB.
  const updatedCart = await cart.save();

  return {
    success: true,
    message: "Product quantity updated.",
    data: updatedCart,
  };
},

getCart: async (userId: Types.ObjectId) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");

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
  productId: Types.ObjectId,
  quantity: number,
  userId: Types.ObjectId
) => {
  const productExist = await Product.findById(productId);

  if (!productExist) {
    return {
      success: false,
      message: "Product not found.",
      code: "NOT_FOUND",
    };
  }

  if (!productExist.active) {
    return {
      success: false,
      message: "Product is inactive, can't update cart.",
      code: "PRODUCT_INACTIVE",
    };
  }

  const cartExist = await Cart.findOne({ userId });

  if (!cartExist) {
    return {
      success: false,
      message: "Cart item not found.",
      code: "CART_ITEM_NOT_FOUND",
    };
  }

  const itemIndex = cartExist.items.findIndex(
    (item: CartItemDataFormat) =>
      item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return {
      success: false,
      message: "Cart item not found.",
      code: "CART_ITEM_NOT_FOUND",
    };
  }

  if (quantity > productExist.stock) {
    return {
      success: false,
      message: "Invalid quantity.",
      code: "INVALID_QUANTITY",
    };
  }

// As soon as the quantity reaches 0, we need to delete that particular cart details.
  if (quantity === 0) {
    cartExist.items.splice(itemIndex, 1);

    const updatedCart = await cartExist.save();

    return {
      success: true,
      message: "Product removed from cart.",
      data: updatedCart,
    };
  }

  cartExist.items[itemIndex].quantity = quantity;

  const updatedCart = await cartExist.save();

  return {
    success: true,
    message: "Cart quantity updated successfully.",
    data: updatedCart,
  };
},

deleteCartItem: async (
  productId: Types.ObjectId,
  userId: Types.ObjectId
) => {
  const cartExist = await Cart.findOne({ userId });

  if (!cartExist) {
    return {
      success: false,
      message: "Cart item not found.",
      code: "CART_ITEM_NOT_FOUND",
    };
  }

  const itemIndex = cartExist.items.findIndex(
    (item: CartItemDataFormat) =>
      item.productId.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    return {
      success: false,
      message: "Cart item not found.",
      code: "CART_ITEM_NOT_FOUND",
    };
  }

  cartExist.items.splice(itemIndex, 1);

  const updatedCart = await cartExist.save();

  return {
    success: true,
    message: "Product removed from cart.",
    data: updatedCart,
  };
},

clearCart: async (userId: Types.ObjectId) => {
  const cartExist = await Cart.findOne({ userId });

  if (!cartExist) {
    return {
      success: true,
      message: "Cart is already empty.",
      data: {
        userId,
        items: [],
      },
    };
  }

  cartExist.items = [];

  const clearedCart = await cartExist.save();

  return {
    success: true,
    message: "Cart cleared successfully.",
    data: clearedCart,
  };
},

};

module.exports = cartService;


