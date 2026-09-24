import { apiSlice } from "./apiSlice";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

interface CustomersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<UserResponse, void>({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    getCustomers: build.query<CustomersResponse, void>({
      query: () => "/users/customers",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetCustomersQuery,
} = userApi;