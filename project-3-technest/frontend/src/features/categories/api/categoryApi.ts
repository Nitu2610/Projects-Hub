import { ApiResponse } from "../../../types/api.types";
import {
  AddCategoryRequest,
  AdminCategory,
  CustomerCategory,
  UpdateCategoryRequest,
  UpdateCategoryStatusRequest,
} from "../../../types/category.types";
import { apiSlice } from "../../../redux/api/apiSlice";

interface AdminCategoriesResponse {
  categories: AdminCategory[];
  parentCategories: AdminCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
getCategories: build.query<
  ApiResponse<AdminCategoriesResponse | CustomerCategory[]>,
  {
    page?: number;
    limit?: number;
  } | void
>({
  query: (params) => ({
    url: "/category",
    params: params ?? undefined,
  }),
  providesTags: ["Category"],
}),

    addCategory: build.mutation<ApiResponse<CustomerCategory>, AddCategoryRequest>({
      query: (body) => ({
        url: "/category/add-category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: build.mutation<
      ApiResponse<CustomerCategory>,
      UpdateCategoryRequest
    >({
      query: ({ id, name }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategoryStatus: build.mutation<
      ApiResponse<CustomerCategory>,
      UpdateCategoryStatusRequest
    >({
      query: ({ id, active }) => ({
        url: `/category/${id}/status`,
        method: "PATCH",
        body: { active },
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
} = categoryApi;
