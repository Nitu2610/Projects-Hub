import { apiSlice } from "./apiSlice";

interface Category {
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
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApi;