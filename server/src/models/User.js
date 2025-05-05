import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [30, "Name must be at most 30 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowecase: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
    },
    avatar: {
      url: { type: String },
      publicId: { type: String },
    },
    mobile: {
      type: String,
      default: "",
    },
    emailVerificationToken: {
      type: String,
      index: true,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
      default: "",
    },
    passwordResetExpires: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    addressDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    lastLoginDate: {
      type: Date,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
