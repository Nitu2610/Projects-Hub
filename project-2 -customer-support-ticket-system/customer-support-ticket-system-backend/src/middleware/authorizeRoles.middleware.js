const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const clientRole = req.user.role;

    const checkRole = allowedRoles.includes(clientRole);

    if (!checkRole) {
      return res.status(403).json({
        status: false,
        message: "Access denied",
      });
    }

    next();
  };
};


module.exports=authorizeRoles;