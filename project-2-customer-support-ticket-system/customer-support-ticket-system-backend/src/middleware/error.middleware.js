// Centralized error handler for unexpected server errors.
//
// Errors passed through asyncHandler reach this middleware via next(error.)
// Keeping unexpected error handling her prevents controllers from
// duplicating unexpected-error responses.
const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorMiddleware;
