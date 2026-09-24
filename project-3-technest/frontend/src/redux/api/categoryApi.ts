import { apiSlice } from "./apiSlice";

interface parentDataFormat{
    _id: string | null;
    name: string | null;
  }
export interface Category {
  _id: string;
  name: string;
  normalizedName: string;
  parent: parentDataFormat | null;
  active: boolean;
}

export interface AdminCategory {
  _id: string;
  name: string;
  active: boolean;
  productCount: number;
  parent: parentDataFormat | null;
}

interface GetCategoriesResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

interface CategoryResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AddCategoryRequest {
  name: string;
  parent?: string | null;
}

interface UpdateCategoryRequest {
  id: string;
  name: string;
}

interface UpdateCategoryStatusRequest {
  id: string;
  active: boolean;
}

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<
      GetCategoriesResponse<Category | AdminCategory>,
      void
    >({
      query: () => "/category",
      providesTags: ["Category"],
    }),

    addCategory: build.mutation<
      CategoryResponse<Category>,
      AddCategoryRequest
    >({
      query: (body) => ({
        url: "/category/add-category",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: build.mutation<
      CategoryResponse<Category>,
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
      CategoryResponse<Category>,
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