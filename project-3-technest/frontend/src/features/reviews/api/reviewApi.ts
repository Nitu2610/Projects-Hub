import { apiSlice } from "../../../redux/api/apiSlice";
import { ApiMessageResponse, ApiResponse } from "../../../types/api.types";
import { CreateReviewRequest, ProductReviewsData, Review, UpdateReviewRequest } from "../../../types/review.types";




export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProductReviews: build.query<ApiResponse<ProductReviewsData>, string>({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Review", id: productId },
      ],
    }),

    createReview: build.mutation<ApiResponse<Review>, CreateReviewRequest>({
      query: (reviewDetails) => ({
        url: "/reviews",
        method: "POST",
        body: reviewDetails,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Review", id: productId },
      ],
    }),

    updateReview: build.mutation<ApiResponse<Review>, UpdateReviewRequest>({
      query: ({ reviewId, rating, comment }) => ({
        url: `/reviews/${reviewId}`,
        method: "PATCH",
        body: {
          rating,
          comment,
        },
      }),
      invalidatesTags: ["Review"],
    }),

    deleteReview: build.mutation<ApiMessageResponse, string>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

    getAllReviews: build.query<ApiResponse<Review[]>, void>({
      query: () => "/reviews/admin",
      providesTags: ["Review"],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
} = reviewApi;
