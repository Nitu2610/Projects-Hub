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

    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : 1;
    const limit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : 10;

    const response = await productService.getProducts(
      role,
      categoryId,
      search,
      sort,
      page,
      limit,
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
      if (response.code === "INVALID_REQUEST") {
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
      data: response.data,
    });
  },

  getProductDetails: async (req: Request, res: Response) => {
    const role = req.user.role;
    const productId = req.params.productId;

    const response = await productService.getProductDetails(role, productId);

    if (!response.success) {
      if (response.code === "INVALID_PRODUCT_ID") {
        return res.status(400).json({
          success: response.success,
          message: response.message,
        });
      }
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
    }

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  updateProduct: async (req: Request, res: Response) => {
    const productId = req.params.productId;

    const response = await productService.updateProduct(productId, req.body);

    if (!response.success) {
      if (response.code === "INVALID_PRODUCT_ID") {
        return res.status(400).json(response);
      }

      if (response.code === "INVALID_CATEGORY") {
        return res.status(400).json(response);
      }

      if (response.code === "INCORRECT_DISCOUNTED_PRICE") {
        return res.status(400).json(response);
      }

      if (response.code === "INACTIVE_CATEGORY") {
        return res.status(409).json(response);
      }

      if (response.code === "NOT_FOUND") {
        return res.status(404).json(response);
      }
    }

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  deactivateProduct: async (req: Request, res: Response) => {
    const productId = req.params.productId;

    const response = await productService.deactivateProduct(productId);

    if (!response.success) {
      if (response.code === "INVALID_PRODUCT_ID") {
        return res.status(400).json(response);
      }

      if (response.code === "NOT_FOUND") {
        return res.status(404).json(response);
      }

      if (response.code === "ALREADY_INACTIVE") {
        return res.status(409).json(response);
      }
    }

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },
  
};

module.exports = productController;
