import { apiSlice } from "./apiSlice";

export interface Review {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
  };
  product: { title: string };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewsData {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  canReview: boolean;
}

interface ReviewsResponse {
  success: boolean;
  message: string;
  data: ReviewsData[];
}

interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

interface UpdateReviewRequest {
  reviewId: string;
  rating?: number;
  comment?: string;
}

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProductReviews: build.query<ReviewsResponse, string>({
      query: (productId) => ({
        url: `/reviews/product/${productId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, productId) => [
        { type: "Review", id: productId },
      ],
    }),

    createReview: build.mutation<Review, CreateReviewRequest>({
      query: (reviewDetails) => ({
        url: "/reviews",
        method: "POST",
        body: reviewDetails,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Review", id: productId },
      ],
    }),

    updateReview: build.mutation<Review, UpdateReviewRequest>({
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

    deleteReview: build.mutation<{ success: boolean; message: string }, string>(
      {
        query: (reviewId) => ({
          url: `/reviews/${reviewId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Review"],
      },
    ),

    getAllReviews: build.query<ReviewsResponse, void>({
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
