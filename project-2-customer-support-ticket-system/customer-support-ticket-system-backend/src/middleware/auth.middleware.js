const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const authHeaderParts = authHeader.split(" ");

  if (
    authHeaderParts.length !== 2 ||
    authHeaderParts[0] !== "Bearer" ||
    authHeaderParts[1].length === 0
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format",
    });
  }

  const token = authHeaderParts[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;
