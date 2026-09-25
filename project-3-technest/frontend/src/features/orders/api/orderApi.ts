import { apiSlice } from "../../../redux/api/apiSlice";
import { ApiResponse } from "../../../types/api.types";
import {
  CancelOrderRequest,
  CreateOrderRequest,
  Order,
} from "../../../types/order.types";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderRequest>({
      query: ({
        addressId,
        paymentMethod,
        paymentData,
      }: {
        addressId: string;
        paymentMethod: "COD" | "UPI" | "CARD";
        paymentData?: {
          upiId?: string;
          cardType?: "CREDIT" | "DEBIT";
        };
      }) => ({
        url: "/orders/create-order",
        method: "POST",
        body: {
          addressId,
          paymentMethod,
          paymentData,
        },
      }),

      invalidatesTags: ["Order", "Cart"],
    }),

    getOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (orderId: string) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    cancelOrder: builder.mutation<ApiResponse<Order>, CancelOrderRequest>({
      query: ({
        orderId,
        cancellationReason,
      }: {
        orderId: string;
        cancellationReason: string;
      }) => ({
        url: `/orders/${orderId}/cancel`,
        method: "PATCH",
        body: {
          cancellationReason,
        },
      }),

      invalidatesTags: (_result, _error, { orderId }) => [
        "Order",
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
} = orderApi;
