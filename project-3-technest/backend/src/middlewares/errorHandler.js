const logError = require("../utils/logError");

const errorHandler = (err, req, res, next) => {
  logError(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorHandler;
