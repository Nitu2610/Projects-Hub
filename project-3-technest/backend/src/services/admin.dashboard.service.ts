import { Types } from "mongoose";

const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

interface OrderStatusStat {
  _id: OrderStatus;
  count: number;
}

interface SalesStat {
  _id: string;
  revenue: number;
  totalOrders: number;
}

interface SalesStatsData {
  date: string;
  revenue: number;
  orders: number;
}

interface InventoryStats {
  _id?: null;
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface TotalCustomerStat {
  totalCustomers: number;
}

interface OrderStats {
  _id?: null;
  totalRevenue: number;
  totalOrders: number;
}

interface RecentOrder {
  _id: Types.ObjectId;
  customer: {
    fullName?: string;
    email?: string;
  };
  items: unknown[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  createdAt: Date;
}

const adminDashboardService = {
  getStats: async () => {
    // --------------------------------
    // 1. Overview Stats
    // --------------------------------

    const orderStats: OrderStats[] = await Order.aggregate([
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

    const totalCustomers: TotalCustomerStat[] = await User.aggregate([
      {
        $match: {
          role: "customer",
        },
      },
      {
        $count: "totalCustomers",
      },
    ]);

    const totalRevenue = orderStats[0]?.totalRevenue ?? 0;
    const totalOrders = orderStats[0]?.totalOrders ?? 0;
    const totalCustomersCount = totalCustomers[0]?.totalCustomers ?? 0;

    const averageOrderValue =
      totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    // --------------------------------
    // 2. Order Status Stats
    // --------------------------------

    const orderStatusStats: OrderStatusStat[] = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const orderStatusData = orderStatusStats.reduce<
      Record<OrderStatus, number>
    >(
      (acc: Record<OrderStatus, number>, cur: OrderStatusStat) => {
        acc[cur._id] = cur.count;
        return acc;
      },
      {
        PLACED: 0,
        CONFIRMED: 0,
        SHIPPED: 0,
        DELIVERED: 0,
        CANCELLED: 0,
      },
    );

    // --------------------------------
    // 3. Sales Overview - Last 7 Days
    // --------------------------------

    const endDate = new Date();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const getDateString = (date: Date): string =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}-${String(date.getDate()).padStart(2, "0")}`;

    const sevenDays: string[] = Array.from(
      { length: 7 },
      (_, index): string => {
        const date = new Date(startDate);

        date.setDate(startDate.getDate() + index);

        return getDateString(date);
      },
    );

    const salesStats: SalesStat[] = await Order.aggregate([
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
    ]);

    const salesStatsData: SalesStatsData[] = salesStats.map(
      (item: SalesStat): SalesStatsData => ({
        date: item._id,
        revenue: item.revenue,
        orders: item.totalOrders,
      }),
    );

    const finalSalesStats: SalesStatsData[] = sevenDays.map(
      (date: string): SalesStatsData => {
        const sales = salesStatsData.find(
          (item: SalesStatsData) => item.date === date,
        );

        if (sales) {
          return {
            date,
            revenue: sales.revenue,
            orders: sales.orders,
          };
        }

        return {
          date,
          revenue: 0,
          orders: 0,
        };
      },
    );

    // --------------------------------
    // 4. Inventory Stats
    // --------------------------------

    const inventoryStats: InventoryStats[] = await Product.aggregate([
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

    const inventoryStatsData = inventoryStats[0]
      ? {
          totalProducts: inventoryStats[0].totalProducts ?? 0,
          activeProducts: inventoryStats[0].activeProducts ?? 0,
          lowStockProducts: inventoryStats[0].lowStockProducts ?? 0,
          outOfStockProducts: inventoryStats[0].outOfStockProducts ?? 0,
        }
      : {
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0,
          outOfStockProducts: 0,
        };

    // --------------------------------
    // 5. Recent Orders
    // --------------------------------

    const recentOrders: RecentOrder[] = await Order.aggregate([
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

    // --------------------------------
    // 6. Final Response
    // --------------------------------

    return {
      success: true,
      message: "Fetched the stats.",

      data: {
        overview: {
          totalRevenue,
          totalOrders,
          totalCustomers: totalCustomersCount,
          averageOrderValue,
        },

        orderStatusStats: orderStatusData,

        salesOverview: finalSalesStats,

        inventoryStats: inventoryStatsData,

        recentOrders,
      },
    };
  },
};

module.exports = adminDashboardService;

// ### What fixed your four errors

// Your original errors were caused by these inferred parameters:

// ```ts
// orderStatusStats.reduce((acc, cur) => ...)
// salesStats.map((item) => ...)
// sevenDays.map((date) => {
//   salesStatsData.find((item) => ...)
// })
// ```

// The updated version explicitly types them:

// ```ts
// (acc: Record<OrderStatus, number>, cur: OrderStatusStat)
// ```

// ```ts
// (item: SalesStat)
// ```

// ```ts
// (item: SalesStatsData)
// ```

// I also typed the aggregation results themselves:

// ```ts
// const orderStatusStats: OrderStatusStat[] = await Order.aggregate(...)
// ```

// That gives TypeScript enough information to understand what `acc`, `cur`, and `item` are.

// **One more important change:** I removed this:

// ```ts
// const { _id, ...safeInventoryData } = inventoryStats[0];
// ```

// because if there are no products, `inventoryStats[0]` is `undefined`, causing a runtime exception. The new version safely handles an empty products collection.

// If your Mongoose models already have TypeScript interfaces/types, those can be used instead of the local interfaces above, but this version will work independently with your current CommonJS setup.
