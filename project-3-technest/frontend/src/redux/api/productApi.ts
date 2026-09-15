import { apiSlice } from "./apiSlice";
import type {
  GetProductDetailsResponse,
  GetProductsResponse,
} from "../../types/product";

interface GetProductsParams {
  search?: string;
  categoryId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<GetProductsResponse, GetProductsParams>({
      query: (params) => ({
        url: "/products",
        params,
      }),
    }),

    getProductDetails: build.query<
      GetProductDetailsResponse,
      string
    >({
      query: (productId) => `/products/${productId}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
} = productApi;