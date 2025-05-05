// import Category from "../../models/PreBuildCategory.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const GetSingleProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new ApiError(400, "Product id is required"));
  }

  const findedPrebuild = await Product.findById(productId).populate([
    {
      path: "reviews",
      select: "rating review user createdAt",
      populate: {
        path: "user",
        select: "name email avatar",
      },
    },
    {
      path: "category",
      select: "name",
    },
    // {
    //   path: "components.cpu",

    // }
  ]);

  if (!findedPrebuild) {
    return next(new ApiError(404, "Product not found"));
  }

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: findedPrebuild,
  });
});

export const search = asyncHandler(async (req, res, next) => {
  const { query = "" } = req.query;

  if (!query.trim()) {
    return next(new ApiError(400, "Search query is required"));
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
    status: "active",
  }).populate([
    {
      path: "category",
      select: "name",
    },
    {
      path: "reviews",
      select: "rating review user createdAt",
      populate: {
        path: "user",
        select: "name email avatar",
      },
    },
  ]);

  if (!products || products.length === 0) {
    return next(new ApiError(404, "No products found with this search query"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});

export const getAllProductsForAdmin = asyncHandler(async (req, res, next) => {
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;
  const products = await Product.find({ status: "active" })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });
  const productsCount = await Product.countDocuments({ status: "active" });
  const totalPages = Math.ceil(productsCount / pageSize);

  if (!products || products.length === 0) {
    return next(new ApiError(404, "No products found"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
  });
});

export const getProductsByProductType = asyncHandler(async (req, res, next) => {
  const productType = req.params.productType;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  if (!productType) {
    return next(new ApiError(400, "productType is required"));
  }

  const products = await Product.find({
    productType: productType,
    status: "active",
  })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    productType: productType,
    status: "active",
  });
  const totalPages = Math.ceil(productsCount / pageSize);

  // const findPriceRange = async () => {
  //   const priceRange = await Product.aggregate([
  //     {
  //       $match: {
  //         status: "active",
  //         price: { $gte: 0 },
  //       },
  //     },
  //     {
  //       $project: {
  //         price: { $ifNull: ["$price", 0] }, // Replace null or undefined prices with 0
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: null, // Group all documents together
  //         minPrice: { $min: "$price" },
  //         maxPrice: { $max: "$price" },
  //       },
  //     },
  //   ]);

  //   const minPrice = priceRange[0]?.minPrice || 0;
  //   const maxPrice = priceRange[0]?.maxPrice || 0;

  //   return { minPrice, maxPrice };
  // };

  // const { minPrice, maxPrice } = await findPriceRange();

  if (!products || products.length === 0) {
    return next(new ApiError(404, "No products found"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
    // priceRange: { minPrice, maxPrice },
  });
});

export const getProductsByStatus = asyncHandler(async (req, res, next) => {
  const status = req.params.status;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  if (!status) {
    return next(new ApiError(400, "Status is required"));
  }

  const products = await Product.find({
    status: status,
  })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    status: status,
  });

  const totalPages = Math.ceil(productsCount / pageSize);

  if (products.length === 0) {
    return next(new ApiError(404, "No products found with this status"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
  });
});

export const getPrebuildProductsByCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  if (!categoryId) {
    return next(new ApiError(400, "categoryId is required"));
  }

  const products = await Product.find({
    status: "active",
    category: categoryId,
  })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    status: "active",
    category: categoryId,
  });

  const totalPages = Math.ceil(productsCount / pageSize);

  if (products.length === 0) {
    return next(new ApiError(404, "No products found with this category"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const { productId } = req.body;

  if (!productId) {
    return next(new ApiError(400, "Product id is required"));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ApiError(404, "Product not found"));
  }

  // Delete images from cloudinary
  if (product?.images?.length > 0 && product.images[0]?.publicId) {
    for (const image of product.images) {
      if (image?.publicId) {
        const cloudinaryDeleteResult = await deleteImageFromCloudinary(
          image.publicId
        );
        if (!cloudinaryDeleteResult) {
          return next(
            new ApiError(
              500,
              `Failed to delete image with ID: ${image.publicId} from Cloudinary`
            )
          );
        }
      }
    }
  }

  // pull ids from category and sub category if there

  const category = await Category.findById(product.category);

  if (product.subCategory && product.subCategory !== "") {
    const subCategory = category.subCategories.find(
      (subCat) => subCat.name === product.subCategory && subCat.products > 0
    );

    if (subCategory) {
      subCategory.products.pull(product._id);
      await subCategory.save();
    }
  }

  category.products.pull(product._id);
  await category.save();

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    return next(
      new ApiError(500, "Something went wrong while deleting product")
    );
  }

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const deleteMultipleProducts = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    return next(new ApiError(400, "Product ids are required"));
  }

  for (const productId of productIds) {
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    // Delete images from cloudinary
    if (product?.images?.length > 0 && product.images[0]?.publicId) {
      for (const image of product.images) {
        if (image?.publicId) {
          const cloudinaryDeleteResult = await deleteImageFromCloudinary(
            image.publicId
          );
          if (!cloudinaryDeleteResult) {
            return next(
              new ApiError(
                500,
                `Failed to delete image with ID: ${image.publicId} from Cloudinary`
              )
            );
          }
        }
      }
    }

    // pull ids from category and sub category if there

    const category = await Category.findById(product.category);

    if (product.subCategory && product.subCategory !== "") {
      const subCategory = category.subCategories.find(
        (subCat) => subCat.name === product.subCategory && subCat.products > 0
      );

      if (subCategory) {
        subCategory.products.pull(product._id);
        await subCategory.save();
      }
    }

    category.products.pull(product._id);
    await category.save();

    await Product.findByIdAndDelete(productId);
  }

  return res.status(200).json({
    success: true,
    message: "Products deleted successfully",
  });
});
