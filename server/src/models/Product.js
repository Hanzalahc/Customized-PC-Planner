import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    status: {
      type: String,
      default: "active",
    },
    sale: {
      type: Number,
      default: 0,
    },
    productType: {
      type: String,
      index: true,
      enum: [
        "Cpu",
        "Ram",
        "Prebuild",
        "Gpu",
        "Cooler",
        "Psu",
        "Storage",
        "Case",
        "Motherboard",
      ],
      required: true,
    },
    model: {
      type: String,
      required: true,
      index: true,
      trim: true, // e.g., "i5-12400F"
      unique: true,
    },
    warranty: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      default: "",
    },
    powerCategory: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      required: true,
    },
  },
  {
    discriminatorKey: "productType",
    timestamps: true,
  }
);

productSchema.statics.updateRating = async function (productId) {
  const product = await this.findById(productId).populate("reviews", "rating");

  if (product.reviews.length > 0) {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.rating = totalRating / product.reviews.length;
    await product.save();
  }
};

export default mongoose.model("Product", productSchema);
