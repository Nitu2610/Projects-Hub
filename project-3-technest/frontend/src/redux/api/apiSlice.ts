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

const baseViteURL = import.meta.env.VITE_API_URL;

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: baseViteURL,
    credentials: "include",
  }),

  endpoints: (build) => ({
    getMe: build.query<GetMeResponse, void>({
      query: () => "/users/me",
    }),

    login: build.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation } = apiSlice;
