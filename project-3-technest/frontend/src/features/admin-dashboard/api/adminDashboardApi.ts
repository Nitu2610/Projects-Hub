import { apiSlice } from "../../../redux/api/apiSlice";
import { DashboardData } from "../../../types/admin-dashboard";
import { ApiResponse } from "../../../types/api.types";

export const adminDashboardApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAdminDashboardStats: build.query<ApiResponse<DashboardData>, void>({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAdminDashboardStatsQuery } = adminDashboardApi;
