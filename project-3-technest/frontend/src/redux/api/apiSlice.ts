import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

interface ApiError {
  success: boolean;
  message: string;
  status: number;
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
    fullNamw: string;
    email: string;
    mobile: string;
    role: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

const baseViteURL = import.meta.env.VITE_API_URL;

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: baseViteURL,
    credentials: "include",
  }),

  endpoints: (build) => ({
    register: build.mutation<RegisterResponse, RegisterRequest>({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
    }),

    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
    }),

    logout: build.mutation<{ success: Boolean; message: string }, void>({
      query: () => ({
        url: "users/logout",
        method: "POST",
      }),
    }),

    getMe: build.query<GetMeResponse, void>({
      query: () => "/users/me",
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation, useRegisterMutation,
  useLogoutMutation, 
 } =
  apiSlice;
