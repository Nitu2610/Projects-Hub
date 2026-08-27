const { validationResult } = require("express-validator");

// Converts validation errors produced by express-validator
// into a consistent API response.
//
// Route flow:
// validation rules -> validationMiddleware -> controller

const validationMiddleware = (req, res, next) => {
  // Collect validation results from the request.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      data: {
        // Convert the validation errors into an array
        // and include them in the API response.
        errors: errors.array(),
      },
    });
  }

  next();
};

module.exports = validationMiddleware;
