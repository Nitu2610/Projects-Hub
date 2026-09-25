import { apiSlice } from "../../../redux/api/apiSlice";
import { ApiResponse } from "../../../types/api.types";
import {
  AdminCancelOrderRequest,
  Order,
  UpdateOrderStatusRequest,
} from "../../../types/order.types";

export const adminOrderApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAdminOrders: build.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: "/admin/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    getAdminOrderById: build.query<ApiResponse<Order>, string>({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    updateAdminOrderStatus: build.mutation<
      ApiResponse<Order>,
      UpdateOrderStatusRequest
    >({
      query: ({ orderId, orderStatus }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: "PATCH",
        body: { orderStatus },
      }),
      invalidatesTags: ["Order"],
    }),

    cancelAdminOrder: build.mutation<
      ApiResponse<Order>,
      AdminCancelOrderRequest
    >({
      query: ({ orderId, cancellationReason }) => ({
        url: `/admin/orders/${orderId}/cancel`,
        method: "PATCH",
        body: { cancellationReason },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useUpdateAdminOrderStatusMutation,
  useCancelAdminOrderMutation,
} = adminOrderApi;
