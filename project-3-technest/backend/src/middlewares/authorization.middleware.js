const authorize = (role) => {
  return (req, res, next) => {
    if (role !== req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

module.exports = authorize;
