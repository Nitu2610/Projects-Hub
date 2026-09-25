import { apiSlice } from "../../../redux/api/apiSlice";
import type { ApiResponse } from "../../../types/api.types";
import type {
  Product,
  ProductFormData,
  ProductPagination,
  ProductQueryParams,
} from "../../../types/product.types";


export const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<
      ApiResponse<{
        products: Product[];
        pagination: ProductPagination;
      }>,
      ProductQueryParams
    >({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: ["Product"],
    }),

    getProductDetails: build.query<ApiResponse<Product>, string>({
      query: (productId) => `/products/${productId}`,
    }),

    addProduct: build.mutation<ApiResponse<Product>, ProductFormData>({
      query: (productData) => ({
        url: "/products/add-product",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: build.mutation<
      ApiResponse<Product>,
      { productId: string; productData: ProductFormData }
    >({
      query: ({ productId, productData }) => ({
        url: `/products/${productId}`,
        method: "PATCH",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    deactivateProduct: build.mutation<ApiResponse<Product>, string>({
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
