import {
  CancellationReason,
  OrderStatus,
  Order,
} from "../../types/order.types";
import { apiSlice } from "./apiSlice";

interface OrderResponse {
  success: boolean;
  message: string;
  data: Order | Order[];
}

interface UpdateOrderStatusRequest {
  orderId: string;
  orderStatus: OrderStatus;
}

interface AdminCancelOrderRequest {
  orderId: string;
  cancellationReason: CancellationReason;
}

export const adminOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOrders: builder.query<OrderResponse, void>({
      query: () => ({
        url: "/admin/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    getAdminOrderById: builder.query<OrderResponse, string>({
      query: (orderId) => ({
        url: `/admin/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    updateAdminOrderStatus: builder.mutation<
      OrderResponse,
      UpdateOrderStatusRequest
    >({
      query: ({ orderId, orderStatus }) => ({
        url: `/admin/orders/${orderId}/status`,
        method: "PATCH",
        body: { orderStatus },
      }),
      invalidatesTags: ["Order"],
    }),

    cancelAdminOrder: builder.mutation<OrderResponse, AdminCancelOrderRequest>({
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
