// Wraps async controllers so rejected promises are forwarded
// to Express's centralized error-handling middleware.
//
// Request flow:
// Controller throws/rejects
//          ⬇️
// asyncHandler catches the error
//          ⬇️
// next(error)
//          ⬇️
// errorMiddleware
const asyncHandler = (controllerFunction) => {
  return async (req, res, next) => {
    try {
      await controllerFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncHandler;
