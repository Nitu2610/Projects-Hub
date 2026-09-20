import { apiSlice } from "./apiSlice";

export interface Category {
  _id: string;
  name: string;
  normalizedName: string;
  parent: string | null;
  active: boolean;
}

interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<GetCategoriesResponse, void>({
      query: () => "/category",
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;
