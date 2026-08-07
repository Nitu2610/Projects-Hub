const asyncHandler = (controllerFuntion) => {
  return async (req, res, next) => {
    try {
      await controllerFuntion(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = asyncHandler;
