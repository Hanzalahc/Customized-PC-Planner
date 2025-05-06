// import Category from "../../models/PreBuildCategory.js";
import Product from "../models/Product.js";
import Prebuild from "../models/PreBuiltPC.js";
import PreBuildCategory from "../models/PreBuildCategory.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Joi from "joi";
import { deleteImageFromCloudinary } from "../utils/cloudinary.js";

export const AddPrebuild = asyncHandler(async (req, res, next) => {
  const userData = req?.user;

  if (userData?.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }


  const {
    name,
    description,
    content,
    images,
    brand,
    stock,
    isFeatured,
    model,
    warranty,
    weight,
    powerCategory,
    productType,
    components,
    category,
    hasUpgradeOptions,
    upgradeOptions,
    gamingCasePrice,
    airCoolerPrice,
    motherboardPrice,
    psuPrice,
    storagePrice,
    ramPrice,
    gpuPrice,
    cpuPrice,
  } = req.body;

  const duplicateProduct = await Product.findOne({
    name,
    productType,
    model,
  });

  if (duplicateProduct) {
    return next(new ApiError(409, "Product already exists with this name"));
  }

  const categoryData = await PreBuildCategory.findOne({
    name: category,
  });

  if (!categoryData) {
    return next(new ApiError(404, "Category not found"));
  }

  // calculat pricer and old price

  const prices = [
    gamingCasePrice,
    airCoolerPrice,
    motherboardPrice,
    psuPrice,
    storagePrice,
    ramPrice,
    gpuPrice,
    cpuPrice,
  ];

  const totalPrice = prices.reduce((sum, price) => sum + (price || 0), 0);

  const newPrebuild = new Prebuild({
    name,
    description,
    content,
    images,
    brand,
    price: totalPrice,
    oldPrice: totalPrice,
    discount: 0,
    stock,
    isFeatured,
    model,
    warranty,
    weight: weight ?? "",
    powerCategory,
    productType,
    components,
    category: categoryData._id,
    hasUpgradeOptions,
    upgradeOptions,
  });

  const savedPrebuild = await newPrebuild.save();

  if (!savedPrebuild) {
    return next(
      new ApiError(500, "Something went wrong while saving Prebuild")
    );
  }

  // Add the new prebuild to the category
  categoryData.products.push(savedPrebuild._id);
  await categoryData.save();

  res.status(201).json({
    message: "Prebuild created successfully",
    success: true,
    data: savedPrebuild,
  });
});

export const GetAllPrebuildDropdown = asyncHandler(async (req, res, next) => {
  const allPrebuilds = await Product.find({
    status: "active",
    productType: "Prebuild",
  })
    .select(
      " images name description price oldPrice discount rating model components isFeatured"
    )
    .populate([
      {
        path: "category",
        select: "name",
      },
      {
        path: "components.cpu",
        select: "model",
      },
      {
        path: "components.gpu",
        select: "model",
      },
    ]);

  if (!allPrebuilds || allPrebuilds.length === 0) {
    return next(new ApiError(404, "No Prebuilds found"));
  }

  const totalPrebuilds = allPrebuilds.length;

  res.status(200).json({
    success: true,
    message: "All Prebuilds fetched successfully",
    data: {
      prebuilds: allPrebuilds,
      totalPrebuilds,
    },
  });
});

// export const GetSinglePrebuild = asyncHandler(async (req, res, next) => {
//   const { productId } = req.params;

//   if (!productId) {
//     return next(new ApiError(400, "Product id is required"));
//   }

//   const findedPrebuild = await Product.findById(productId).populate([
//     {
//       path: "reviews",
//       select: "rating review user createdAt",
//       populate: {
//         path: "user",
//         select: "name email avatar",
//       },
//     },
//   ]);

//   if (!findedPrebuild) {
//     return next(new ApiError(404, "Product not found"));
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Product fetched successfully",
//     data: findedPrebuild,
//   });
// });

export const UpdatePrebuild = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const productId = req.params.productId;

  const { error } = validatePrebuild(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  if (!productId) {
    return next(new ApiError(400, "Product id is required"));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ApiError(404, "Product not found with this ID"));
  }

  const {
    name,
    description,
    content,
    images,
    brand,
    price,
    oldPrice,
    discount,
    stock,
    status,
    isFeatured,
    model,
    warranty,
    weight,
    powerCategory,
    productType,
    components,
    category,
    hasUpgradeOptions,
    upgradeOptions,
    gamingCasePrice,
    airCoolerPrice,
    motherboardPrice,
    psuPrice,
    storagePrice,
    ramPrice,
    gpuPrice,
    cpuPrice,
  } = req.body;

  const areImagesSame = product.images
    .map((img) => img.publicId)
    .sort()
    .every(
      (publicId, index) =>
        publicId === images.map((img) => img.publicId).sort()[index]
    );

  // Delete old images from cloudinary
  if (!areImagesSame) {
    const deleteRemovedImagesFromCloudinary = async (oldImages, newImages) => {
      const imagesToDelete = oldImages.filter(
        (oldImage) =>
          !newImages.some((newImage) => newImage.publicId === oldImage.publicId)
      );

      for (let image of imagesToDelete) {
        const cloudinaryDeleteResult = await deleteImageFromCloudinary(
          image.publicId
        );
        if (image.publicId && !cloudinaryDeleteResult) {
          console.error(
            `Failed to delete image ${image.publicId} from Cloudinary`
          );
        }
      }
    };

    const oldImages = product.images || [];
    const newImages = images || [];

    await deleteRemovedImagesFromCloudinary(oldImages, newImages);
  }

  const categoryData = await PreBuildCategory.findOne({
    name: category,
  });

  if (!categoryData) {
    return next(new ApiError(404, "Category not found"));
  }

  // calculat pricer and old price

  const prices = [
    gamingCasePrice,
    airCoolerPrice,
    motherboardPrice,
    psuPrice,
    storagePrice,
    ramPrice,
    gpuPrice,
    cpuPrice,
  ];

  const totalPrice = prices.reduce((sum, price) => sum + (price || 0), 0);

  if (product.category !== categoryData._id.toString()) {
    const existingCategory = await PreBuildCategory.findByIdAndUpdate(
      product.category,
      { $pull: { products: productId } },
      { new: true }
    );

    if (!existingCategory) {
      return next(new ApiError(404, "Category not found"));
    }
    const newCategory = await PreBuildCategory.findByIdAndUpdate(
      categoryData._id,
      { $addToSet: { products: productId } },
      { new: true }
    );

    if (!newCategory) {
      return next(new ApiError(404, "Category not found"));
    }
  }

  const updatedPrebuild = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      content,
      images,
      brand,
      price: totalPrice === price ? totalPrice : price,
      oldPrice: totalPrice === oldPrice ? totalPrice : oldPrice,
      status,
      discount,
      stock,
      isFeatured,
      model,
      warranty,
      weight: weight ?? "",
      powerCategory,
      productType,
      components,
      category: categoryData._id,
      hasUpgradeOptions,
      upgradeOptions,
    },
    { new: true }
  );

  if (!updatedPrebuild) {
    return next(
      new ApiError(500, "Something went wrong while updating Prebuild")
    );
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedPrebuild,
  });
});

export const RemovePrebuildById = asyncHandler(async (req, res, next) => {
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
          console.error(
            `Failed to delete image ${image.publicId} from Cloudinary`
          );
        }
      }
    }
  }

  // Remove the product from the category

  const category = await PreBuildCategory.findByIdandUpdate(
    product.category,
    { $pull: { products: productId } },
    { new: true }
  );

  if (!category) {
    return next(new ApiError(404, "Category not found"));
  }

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

function validatePrebuild(data) {
  const schema = Joi.object({
    name: Joi.string().min(40).max(90).required(),
    description: Joi.string().min(40).max(1000).required(),
    content: Joi.string().min(40).max(10000).required(),
    images: Joi.array().min(1).required(),
    brand: Joi.string().required().min(3).max(30),
    model: Joi.string().required().min(3).max(40),
    status: Joi.string().valid("active", "inactive").optional(),
    discount: Joi.number().min(0).max(100).optional(),
    price: Joi.number().required(),
    oldPrice: Joi.number().required(),
    stock: Joi.number().min(0).required(),
    isFeatured: Joi.boolean().required(),
    warranty: Joi.string().required().min(3).max(20),
    weight: Joi.string().required().min(3).max(20),
    powerCategory: Joi.number().required().min(0).max(10),
    productType: Joi.string()
      .valid(
        "Prebuild",
        "Ram",
        "Prebuild",
        "Prebuild",
        "Cooler",
        "Psu",
        "Storage",
        "Case",
        "Motherboard"
      )
      .required(),
    status: Joi.string().optional(),
    components: Joi.object().required(),
    cpuPrice: Joi.number().required(),
    gpuPrice: Joi.number().required(),
    ramPrice: Joi.number().required(),
    storagePrice: Joi.number().required(),
    gamingCasePrice: Joi.number().required(),
    airCoolerPrice: Joi.number().required(),
    motherboardPrice: Joi.number().required(),
    psuPrice: Joi.number().required(),
    category: Joi.string().required(),
    hasUpgradeOptions: Joi.boolean().optional(),
    upgradeOptions: Joi.array().optional(),
  });

  return schema.validate(data);
}
