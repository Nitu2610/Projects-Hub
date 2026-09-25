export interface ReviewUser {
  _id: string;
  fullName: string;
  email?: string;
}

export interface ReviewProduct {
  _id: string;
  title: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  product: ReviewProduct;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewsData {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  canReview: boolean;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewRequest {
  reviewId: string;
  rating?: number;
  comment?: string;
}