import { Types } from "mongoose";

const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");


const adminDashboardService = {
  getStats: async () => {
    const orderStats = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "CANCELLED",
          },
        },
      },
      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$totalAmount",
          },

          totalOrders: {
            $sum: 1,
          },
   
        },
      },
    ]);

    const totalCustomers = await User.aggregate([
  {
    $match: {
      role: "customer",
    },
  },
  {
    $count: "totalCustomers",
  },
]);

// Calculate AOV
const totalRevenue = orderStats[0]?.totalRevenue ?? 0;
const totalOrder = orderStats[0]?.totalOrders ?? 0;
const averageOrderValue =
  totalOrder > 0 ? Math.floor(totalRevenue / totalOrder) : 0;

    return {
      success: true,
      message: "Fetched the stats.",
      data: {
        ...orderStats[0],
        ...totalCustomers[0],
        averageOrderValue,
      },
    };
  },
};

module.exports = adminDashboardService;
