import mongoose from "mongoose";
import Product from "./Product.js";
import User from "./User.js";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    isNewReview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.post("save", async function () {
  const review = this;

  if (review?.isNewReview) {
    await Product.findByIdAndUpdate(
      review.product,
      { $push: { reviews: review._id } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      review.user,
      { $push: { reviews: review._id } },
      { new: true }
    );

    await Product.updateRating(review.product);
    await review.updateOne({ isNewReview: false });
  }
});

export default mongoose.model("Review", reviewSchema);
