import { apiSlice } from "./apiSlice";

interface CartProduct {
  _id: string;
  title: string;
  image?: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  active: boolean;
}

export interface CartItem {
  productId: CartProduct;
  quantity: number;
}

interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

 interface CartResponse {
  success: boolean;
  message: string;
  data: Cart ;
}

interface CartItemRequest {
  productId: string;
  quantity: number;
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<CartResponse, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToCart: build.mutation<CartResponse, CartItemRequest>({
      query: (body) => ({
        url: "/cart/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: build.mutation<
      CartResponse,
      { productId: string; quantity: number }
    >({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    deleteCartItem: build.mutation<CartResponse, string>({
      query: (productId) => ({
        url: `/cart/items/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: build.mutation<CartResponse, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
} = cartApi;

