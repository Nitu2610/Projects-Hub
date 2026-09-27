import { apiSlice } from "../../../redux/api/apiSlice";
import { ApiResponse } from "../../../types/api.types";
import { Customer } from "../../../types/customer.types";

interface UserProfile {
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  _id: string;
}

interface GetMeResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}


export const customerApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<ApiResponse<Customer[]>, void>({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

   getCustomers: build.query<
  ApiResponse<{
    customers: Customer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>,
  {
    page?: number;
    limit?: number;
  }
>({
  query: ({ page = 1, limit = 10 }) => ({
    url: "/users/customers",
    method: "GET",
    params: {
      page,
      limit,
    },
  }),
  providesTags: ["User"],
}),

   getUserProfile: build.query<ApiResponse<UserProfile>, void>({
      query: () => "/users/profile",
      providesTags: ["Auth"],
    }),

    updateUserProfile: build.mutation({
      query: (profileData: { fullName?: string; mobile?: string }) => ({
        url: "/users/profile",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Auth"],
    }),
    changeUserPassword: build.mutation({
      query: (passwordData: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }) => ({
        url: "/users/change-password",
        method: "PATCH",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetCustomersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangeUserPasswordMutation,
} = customerApi;
