const express = require("express");
const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const {createProductValidator} = require("../validators/product.validator");
const validatorMiddleware = require("../middlewares/validator.middleware");
const asyncHandler = require("../utils/asyncHandler");
const productController = require("../controllers/product.controller");




const productRoute = express.Router();

productRoute.post(
  "/add-product",
  authMiddleware,
  authorize("admin"),
  createProductValidator,
  validatorMiddleware,
  asyncHandler(productController.addProduct),
);

productRoute.get(
  "/",
  authMiddleware,
  authorize(["admin", "customer"]),
  asyncHandler(productController.getProducts),
);

module.exports = productRoute;



//---------------------------


// Need to use this to debug the error- TypeError: argument handler must be a function. Fix- export from validator file were in object and import were not wrapped up with '{}' 
// Below code helps to identify which code is not a fn.
// console.log({
//   authMiddleware,
//   authorize,
//   createProductValidator,
//   validatorMiddleware,
//   asyncHandler,
//   addProduct: productController.addProduct,
// });

// Problem: TypeError: argument handler must be a function occurred while registering the Product route.
// Cause: The validator was exported/imported incorrectly, so Express received a non-function value as a route handler.
// Learning: Express route methods such as router.post() expect each middleware/handler argument to be a function. When this error appears, verify the export/import style and inspect what the imported value actually is.
