const errorMiddleware = (error, req, res, next) => {
  console.error(error);

  return res.status(500).json({
    status: false,
    message: "Internal Server Error",
  });
};

module.exports = errorMiddleware;
