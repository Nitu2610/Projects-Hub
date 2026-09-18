const express = require("express");
const { addressValidator } = require("../validators/address.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");
const addressController = require("../controllers/address.controller");

const addressRoute = express.Router();

addressRoute.post(
  "/",
  authMiddleware,
  authorize("customer"),
  addressValidator,
  validatorMiddleware,
  asyncHandler(addressController.addAddress),
);

addressRoute.get(
  "/",
  authMiddleware,
  authorize("customer"),
  asyncHandler(addressController.getAddresses),
);

addressRoute.get(
  "/:addressId",
  authMiddleware,
  authorize("customer"),
  asyncHandler(addressController.getAddressById),
);

addressRoute.patch(
  "/:addressId",
  authMiddleware,
  authorize("customer"),
  asyncHandler(addressController.updateAddress),
);

addressRoute.delete(
  "/:addressId",
  authMiddleware,
  authorize("customer"),
  asyncHandler(addressController.deleteAddress),
);

module.exports = addressRoute;
