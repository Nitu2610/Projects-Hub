import { Request, Response } from "express";
const addressService = require("../services/address.service");

const addressController = {
  addAddress: async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const { country, ...addressDetails } = req.body;

    const response = await addressService.addAddress(addressDetails, userId);

    if (!response.success) {
      if (response.code === "INVALID_REQUEST") {
        return res.status(409).json({
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

  getAddresses: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const response = await addressService.getAddresses(userId);

    return res.status(200).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  },

  getAddressById: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const response = await addressService.getAddressById(addressId, userId);

    if (!response.success) {
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

  updateAddress: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { addressId } = req.params;
    const updateAddressDetails = req.body;

    const response = await addressService.updateAddress(
      addressId,
      updateAddressDetails,
      userId,
    );

    if (!response.success) {
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

  deleteAddress: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const { addressId } = req.params;

    const response = await addressService.deleteAddress(addressId, userId);

    if (!response.success) {
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
};

module.exports = addressController;
