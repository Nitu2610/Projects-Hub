const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: false,
      message: "Authorization header missing",
    });
  }

  const authParts = authHeader.split(" ");

  if (
    authParts.length !== 2 ||
    authParts[0] !== "Bearer" ||
    authParts[1].length === 0
  ) {
    return res.status(401).json({
      status: false,
      message: "Invalid authorization format",
    });
  }

  const clientToken = authParts[1];

  try {
    const decodedToken = jwt.verify(clientToken, process.env.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
