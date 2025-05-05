import Review from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Joi from "joi";

export const addReview = asyncHandler(async (req, res, next) => {
  const { error } = validateReview(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const { review, rating } = req.body;
  const userDetails = req.user;
  const productId = req.params.productId;

  const reviewExists = await Review.findOne({
    user: userDetails?._id,
    product: productId,
  });

  if (reviewExists) {
    return next(new ApiError(400, "You have already reviewed this product"));
  }

  const newReview = new Review({
    user: userDetails?._id,
    product: productId,
    review,
    rating,
    isNewReview: true,
  });

  const savedReview = await newReview.save();

  if (!savedReview) {
    return next(
      new ApiError(500, "Something went wrong while creating the review")
    );
  }

  return res.status(201).json({
    success: true,
    message: `Review added successfully by ${userDetails?.name}`,
    data: savedReview,
  });
});

export const getReviewsForUser = asyncHandler(async (req, res, next) => {
  const userDetails = req.user;

  const reviews = await Review.find({ user: userDetails?._id })
    .populate("product", "name")
    .select("-__v")
    .sort({ createdAt: -1 });

  const totalReviews = reviews.length;

  if (!reviews || reviews.length === 0) {
    return next(new ApiError(404, `No reviews found for ${userDetails?.name}`));
  }

  return res.status(200).json({
    success: true,
    message: "Reviews fetched successfully",
    data: reviews,
    totalReviews,
  });
});

const validateReview = (data) => {
  const schema = Joi.object({
    review: Joi.string()
      .min(10) // Ensure review is at least 10 characters long
      .max(1000) // Ensure review is no longer than 500 characters
      .required()
      .label("Review")
      .messages({
        "string.min": "Review must be at least 10 characters long",
        "string.max": "Review cannot be longer than 500 characters",
      }),

    rating: Joi.number()
      .required()
      .min(1) // Rating should be between 1 and 5
      .max(5)
      .label("Rating")
      .messages({
        "number.min": "Rating must be at least 1",
        "number.max": "Rating cannot be greater than 5",
        "number.base": "Rating must be a number",
      }),
  });

  return schema.validate(data);
};
