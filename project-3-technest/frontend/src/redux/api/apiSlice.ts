import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseViteURL = import.meta.env.VITE_API_URL;

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: baseViteURL,
    credentials: "include",
  }),

  tagTypes: ["Cart", "Address","Order","Product", "Category"],

  endpoints: () => ({}),
});
