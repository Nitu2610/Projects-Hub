import { apiSlice } from "./apiSlice";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
}

interface DashboardStatsResponse {
  data: DashboardStats[];
  message: string;
  success: boolean;
}

export const adminDashboardApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAdminDashboardStats: build.query<DashboardStatsResponse, void>({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAdminDashboardStatsQuery } = adminDashboardApi;
