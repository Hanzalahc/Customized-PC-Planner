import PreBuildCategory from "../models/PreBuildCategory.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const addNewCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ApiError(400, "Please provide a name for the category"));
  }

  if (!["Gaming", "Productivity", "Featured"].includes(name)) {
    return next(new ApiError(400, "Invalid category name"));
  }

  const existingCategory = await PreBuildCategory.findOne({ name });

  if (existingCategory) {
    return next(new ApiError(400, "Category already exists"));
  }

  const newCategory = await PreBuildCategory.create({ name });

  if (!newCategory) {
    return next(new ApiError(500, "Failed to create category"));
  }
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});
