import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
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

    getOrders: builder.query({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (orderId: string) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, orderId) => [
        { type: "Order", id: orderId },
      ],
    }),

    cancelOrder: builder.mutation({
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
