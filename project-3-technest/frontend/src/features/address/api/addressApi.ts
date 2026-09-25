import { apiSlice } from "../../../redux/api/apiSlice";
import { Address } from "../../../types/address.types";
import { ApiResponse } from "../../../types/api.types";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/addresses
    getAddresses: builder.query<ApiResponse<Address[]>, void>({
      query: () => ({
        url: "/addresses",
        method: "GET",
      }),

      providesTags: ["Address"],
    }),

    // GET /api/addresses/:addressId
    getAddressById: builder.query<ApiResponse<Address>, string>({
      query: (addressId) => ({
        url: `/addresses/${addressId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, addressId) => [
        { type: "Address", id: addressId },
      ],
    }),

    // POST /api/addresses
    addAddress: builder.mutation<Address, Omit<Address, "_id">>({
      query: (addressDetails) => ({
        url: "/addresses",
        method: "POST",
        body: addressDetails,
      }),

      invalidatesTags: ["Address"],
    }),

    // PATCH /api/addresses/:addressId
    updateAddress: builder.mutation<
      Address,
      {
        addressId: string;
        addressDetails: Partial<Omit<Address, "_id">>;
      }
    >({
      query: ({ addressId, addressDetails }) => ({
        url: `/addresses/${addressId}`,
        method: "PATCH",
        body: addressDetails,
      }),

      invalidatesTags: (_result, _error, { addressId }) => [
        { type: "Address", id: addressId },
        "Address",
      ],
    }),

    // DELETE /api/addresses/:addressId
    deleteAddress: builder.mutation<Address, string>({
      query: (addressId) => ({
        url: `/addresses/${addressId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
