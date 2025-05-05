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

  const { error } = validatePrebuild(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
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

  const newPrebuild = new Prebuild({
    name,
    description,
    content,
    images,
    brand,
    price,
    oldPrice,
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
    .select(" images name description price oldPrice discount rating  ")
    .populate({
      path: "category",
      select: "name",
    });

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
  } = req.body;

  const isSameData =
    product.name === name &&
    product.description === description &&
    product.content === content &&
    product.images.length === images.length &&
    product.brand === brand &&
    product.price === price &&
    product.status === status &&
    product.oldPrice === oldPrice &&
    product.discount === discount &&
    product.stock === stock &&
    product.isFeatured === isFeatured &&
    product.model === model &&
    product.warranty === warranty &&
    product.weight === weight &&
    product.powerCategory === powerCategory &&
    product.productType === productType &&
    product.components.cpu === components.cpu &&
    product.components.gpu === components.gpu &&
    product.components.ram === components.ram &&
    product.components.storage.length === components.storage.length &&
    product.components.psu === components.psu &&
    product.components.motherboard === components.motherboard &&
    product.components.airCooler === components.airCooler &&
    product.components.gamingCase === components.gamingCase &&
    product.category === category &&
    product.hasUpgradeOptions === hasUpgradeOptions &&
    product.upgradeOptions.length === upgradeOptions.length;

  const areImagesSame = product.images
    .map((img) => img.publicId)
    .sort()
    .every(
      (publicId, index) =>
        publicId === images.map((img) => img.publicId).sort()[index]
    );

  if (isSameData && areImagesSame) {
    return next(new ApiError(400, "Nothing to update"));
  }

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

  if (product.category !== category) {
    const existingCategory = await PreBuildCategory.findByIdAndUpdate(
      product.category,
      { $pull: { products: productId } },
      { new: true }
    );

    if (!existingCategory) {
      return next(new ApiError(404, "Category not found"));
    }
    const newCategory = await PreBuildCategory.findByIdAndUpdate(
      category,
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
      price,
      oldPrice,
      discount,
      stock,
      status,
      isFeatured,
      model,
      warranty,
      weight: weight ?? "",
      powerCategory,
      productType,
      components,
      category,
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
    price: Joi.number().min(0).required(),
    status: Joi.string().valid("active", "inactive").optional(),
    oldPrice: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).max(100).required(),
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
    components: Joi.object().required(),
    category: Joi.string().required(),
    hasUpgradeOptions: Joi.boolean().optional(),
    upgradeOptions: Joi.array().optional(),
  });

  return schema.validate(data);
}
