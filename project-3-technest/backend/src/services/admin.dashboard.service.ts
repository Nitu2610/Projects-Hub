import type {
  DashboardOverview,
  InventoryStats,
  InventoryStatsData,
  OrderStats,
  OrderStatusStat,
  RecentOrder,
  SalesStat,
  SalesStatsData,
  TotalCustomerStat,
} from "../types/admin.dashboard.types";

import type { OrderStatus } from "../types/order.types";

const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const ORDER_STATUSES: OrderStatus[] = [
  "PLACED",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const getDateString = (date: Date): string => {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(
    2,
    "0"
  )}`;
};

const getLastSevenDays = (): string[] => {
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);

    date.setDate(startDate.getDate() + index);

    return getDateString(date);
  });
};

const getSalesDateRange = () => {
  const endDate = new Date();

  const startDate = new Date();

  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  return {
    startDate,
    endDate,
  };
};

const createOrderStatusData = (
  stats: OrderStatusStat[]
): Record<OrderStatus, number> => {
  const orderStatusData: Record<OrderStatus, number> = {
    PLACED: 0,
    CONFIRMED: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  stats.forEach((stat) => {
    if (ORDER_STATUSES.includes(stat._id)) {
      orderStatusData[stat._id] = stat.count;
    }
  });

  return orderStatusData;
};

const createSalesOverview = (
  salesStats: SalesStat[],
  sevenDays: string[]
): SalesStatsData[] => {
  return sevenDays.map((date) => {
    const sales = salesStats.find(
      (item) => item._id === date
    );

    return {
      date,
      revenue: sales?.revenue ?? 0,
      orders: sales?.totalOrders ?? 0,
    };
  });
};

const adminDashboardService = {
  getStats: async () => {
    /*
     * 1. Overview
     */
    const orderStats: OrderStats[] =
      await Order.aggregate([
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

    const totalCustomers: TotalCustomerStat[] =
      await User.aggregate([
        {
          $match: {
            role: "customer",
          },
        },
        {
          $count: "totalCustomers",
        },
      ]);

    const totalRevenue =
      orderStats[0]?.totalRevenue ?? 0;

    const totalOrders =
      orderStats[0]?.totalOrders ?? 0;

    const totalCustomersCount =
      totalCustomers[0]?.totalCustomers ?? 0;

    const averageOrderValue =
      totalOrders > 0
        ? Math.floor(totalRevenue / totalOrders)
        : 0;

    const overview: DashboardOverview = {
      totalRevenue,
      totalOrders,
      totalCustomers: totalCustomersCount,
      averageOrderValue,
    };

    /*
     * 2. Order status
     */
    const orderStatusStats: OrderStatusStat[] =
      await Order.aggregate([
        {
          $group: {
            _id: "$orderStatus",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    const orderStatusData =
      createOrderStatusData(orderStatusStats);

    /*
     * 3. Seven-day sales overview
     */
    const { startDate, endDate } =
      getSalesDateRange();

    const sevenDays = getLastSevenDays();

    const salesStats: SalesStat[] =
      await Order.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: "CANCELLED",
            },
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "Asia/Kolkata",
              },
            },
            revenue: {
              $sum: "$totalAmount",
            },
            totalOrders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]);

    const salesOverview = createSalesOverview(
      salesStats,
      sevenDays
    );

    /*
     * 4. Inventory
     */
    const inventoryStats: InventoryStats[] =
      await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: {
              $sum: 1,
            },
            activeProducts: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$active", true],
                  },
                  1,
                  0,
                ],
              },
            },
            lowStockProducts: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      {
                        $gte: ["$stock", 1],
                      },
                      {
                        $lt: ["$stock", 5],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            outOfStockProducts: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$stock", 0],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]);

    const inventoryStatsData: InventoryStatsData = {
      totalProducts:
        inventoryStats[0]?.totalProducts ?? 0,

      activeProducts:
        inventoryStats[0]?.activeProducts ?? 0,

      lowStockProducts:
        inventoryStats[0]?.lowStockProducts ?? 0,

      outOfStockProducts:
        inventoryStats[0]?.outOfStockProducts ?? 0,
    };

    /*
     * 5. Recent orders
     */
    const recentOrders: RecentOrder[] =
      await Order.aggregate([
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $unwind: "$customer",
        },
        {
          $project: {
            _id: 1,
            "customer.fullName": 1,
            "customer.email": 1,
            items: 1,
            totalAmount: 1,
            paymentMethod: 1,
            paymentStatus: 1,
            orderStatus: 1,
            createdAt: 1,
          },
        },
      ]);

    return {
      success: true,
      message: "Fetched the stats.",
      data: {
        overview,
        orderStatusStats: orderStatusData,
        salesOverview,
        inventoryStats: inventoryStatsData,
        recentOrders,
      },
    };
  },
};

module.exports = adminDashboardService;