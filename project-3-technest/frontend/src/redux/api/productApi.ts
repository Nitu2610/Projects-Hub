import { apiSlice } from "./apiSlice";
import type {
  GetProductDetailsResponse,
  GetProductsResponse,
  Product,
} from "../../types/product.types";

interface GetProductsParams {
  search?: string;
  categoryId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ProductRequest {
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  active: boolean;
  color?: string;
  specs?: Record<string, string>;
}


export const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<GetProductsResponse, GetProductsParams>({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),

    getProductDetails: build.query<GetProductDetailsResponse, string>({
      query: (productId) => `/products/${productId}`,
    }),

    addProduct: build.mutation<GetProductsResponse, ProductRequest>({
      query: (productData) => ({
        url: "/products/add-product",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: build.mutation<
      GetProductsResponse,
      {
        productId: string;
        productData: ProductRequest;
      }
    >({
      query: ({ productId, productData }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    deactivateProduct: build.mutation<GetProductsResponse, string>({
      query: (productId) => ({
        url: `/products/${productId}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeactivateProductMutation,
} = productApi;
