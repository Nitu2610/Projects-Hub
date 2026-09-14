import { Request, Response } from "express";

const productService = require("../services/product.service");

const productController = {
  addProduct: async (req: Request, res: Response) => {
    const response = await productService.addProduct({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      color: req.body.color,
      price: req.body.price,
      discountedPrice: req.body.discountedPrice,
      stock: req.body.stock,
      specification: req.body.specification,
      category: req.body.category,
    });

    if (!response.success) {
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }

      if (response.code === "INACTIVE_CATEGORY") {
        return res.status(409).json({
          success: response.success,
          message: response.message,
        });
      }

      if (
        response.code === "INCORRECT_DISCOUNTED_PRICE" ||
        response.code === "INVALID_CATEGORY"
      ) {
        return res.status(400).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(201).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  getProducts: async (req: Request, res: Response) => {
    const role = req.user.role;

    const categoryId = typeof req.query.categoryId
      ? req.query.categoryId
      : undefined;
    const search = typeof req.query.search ? req.query.search : undefined;
    const sort =
      typeof req.query.sort === "string" ? req.query.sort : undefined;

    const response = await productService.getProducts(
      role,
      categoryId,
      search,
      sort,
    );

    if (!response.success) {
      if (response.code === "FORBIDDEN") {
        return res.status(403).json({
          success: response.success,
          message: response.message,
        });
      }
      if (response.code === "NOT_FOUND") {
        return res.status(404).json({
          success: response.success,
          message: response.message,
        });
      }
      if (response.code === "INVALID_CATEGORY" || response.code === "INVALID_SORT") {
        return res.status(400).json({
          success: response.success,
          message: response.message,
        });
      }
      if (response.code === "INACTIVE_CATEGORY") {
        return res.status(409).json({
          success: response.success,
          message: response.message,
        });
      }
    }

    return res.status(200).json({
      success: response.success,
      message: response.message,
      totalCount: response.data.length,
      data: response.data,
    });
  },
};

module.exports = productController;
