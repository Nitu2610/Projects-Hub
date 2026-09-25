const express = require("express");

const authMiddleware = require("../middlewares/authentication.middleware");
const authorize = require("../middlewares/authorization.middleware");
const asyncHandler = require("../utils/asyncHandler");

const adminDashboardController = require("../controllers/admin.dashboard.controller");

const adminDashboardRoute = express.Router();

adminDashboardRoute.get(
  "/stats",
  authMiddleware,
  authorize("admin"),
  asyncHandler(adminDashboardController.getStats)
);

module.exports = adminDashboardRoute;