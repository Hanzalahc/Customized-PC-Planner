import mongoose from "mongoose";

const preBuildCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Gaming", "Productivity"],
      trim: true,
      index: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prebuild",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PreBuildCategory", preBuildCategorySchema);
