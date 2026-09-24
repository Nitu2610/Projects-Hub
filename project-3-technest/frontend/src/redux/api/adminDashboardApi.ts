import { apiSlice } from "./apiSlice";

interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

interface OrderStatusStats {
  PLACED: number;
  CONFIRMED: number;
  SHIPPED: number;
  DELIVERED: number;
  CANCELLED: number;
}

interface SalesOverview {
  date: string;
  revenue: number;
  orders: number;
}

interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface RecentOrder {
  _id: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    purchasedPrice: number;
    subtotal: number;
  }[];
  totalAmount: number;
  paymentMethod: "COD" | "UPI" | "CARD";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus:
    | "PLACED"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
  };
}

interface DashboardData {
  overview: DashboardOverview;
  orderStatusStats: OrderStatusStats;
  salesOverview: SalesOverview[];
  inventoryStats: InventoryStats;
  recentOrders: RecentOrder[];
}

interface DashboardStatsResponse {
  data: DashboardData;
  message: string;
  success: boolean;
}

export const adminDashboardApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAdminDashboardStats: build.query<
      DashboardStatsResponse,
      void
    >({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAdminDashboardStatsQuery,
} = adminDashboardApi;