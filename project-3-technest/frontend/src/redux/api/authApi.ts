import { apiSlice } from "./apiSlice";

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

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userData: {
      role: string;
      name: string;
      userId: string;
    };
  };
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    fullName: string;
    email: string;
    mobile: string;
    role: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    userRegister: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
    }),

    userLogin: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    userLogout: build.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    getUserProfile: build.query<GetMeResponse, void>({
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
  useUserRegisterMutation,
  useUserLoginMutation,
  useUserLogoutMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangeUserPasswordMutation,
} = authApi;
