// import Category from "../../models/PreBuildCategory.js";
import Product from "../../models/Product.js";
import Ram from "../../models/componentsModel/Ram.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import Joi from "joi";
import { deleteImageFromCloudinary } from "../../utils/cloudinary.js";

export const AddRam = asyncHandler(async (req, res, next) => {
  const userData = req?.user;

  if (userData?.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const { error } = validateRam(req.body);
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
    manufacturer,
    ramType,
    ramSize,
    latency,
    cacheLatency,
    module,
  } = req.body;

  const duplicateProduct = await Product.findOne({
    name,
    productType,
    model,
  });

  if (duplicateProduct) {
    return next(new ApiError(409, "Product already exists with this name"));
  }

  const newRam = new Ram({
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
    manufacturer,
    ramType,
    ramSize,
    latency,
    cacheLatency,
    module,
  });

  const savedRam = await newRam.save();

  if (!savedRam) {
    return next(new ApiError(500, "Something went wrong while saving Ram"));
  }

  res.status(201).json({
    message: "Ram created successfully",
    success: true,
    data: savedRam,
  });
});

export const GetAllRamWithFiltersAndPagination = asyncHandler(
  async (req, res, next) => {
    const pageNum =
      Number(req.query.data.pageNum) > 0 ? Number(req.query.pageNum) : 1;
    const pageSize = 10;

    const filters = {
      status: "active",
      productType: "Ram",
    };

    if (req.query.data.manufacturor) {
      filters.manufacturer = req.query.data.manufacturor;
    }

    if (req.query.data.featured) {
      filters.isFeatured = req.query.data.featured;
    }

    if (req.query.data.featured === "no") {
      filters.isFeatured = false;
    }

    if (req.query.data.ramType) {
      filters.ramType = req.query.data.ramType;
    }
    const sortOrder = req.query.data?.price === "low" ? 1 : -1;

    const allRams = await Product.find(filters)
      .select(" images name description price oldPrice discount rating ")
      .sort(req.query.data?.price ? { price: sortOrder } : {})
      .skip((pageNum - 1) * pageSize)

      .limit(pageSize);

    if (!allRams || allRams.length === 0) {
      return next(new ApiError(404, "No Rams found"));
    }

    const totalRams = await Product.countDocuments(filters);

    const totalPages = Math.ceil(totalRams / pageSize);

    res.status(200).json({
      success: true,
      message: "All Rams fetched successfully",
      data: {
        rams: allRams,
        totalPages: totalPages,
        totalItems: totalRams,
      },
    });
  }
);

export const GetAllRamDropdown = asyncHandler(async (req, res, next) => {
  const allRams = await Product.find({
    status: "active",
    productType: "Ram",
  }).select(
    " images name description model price oldPrice discount rating ramType"
  );

  if (!allRams || allRams.length === 0) {
    return next(new ApiError(404, "No Rams found"));
  }

  const totalRams = allRams.length;

  res.status(200).json({
    success: true,
    message: "All Rams fetched successfully",
    data: {
      rams: allRams,
      totalRams,
    },
  });
});

// export const GetSingleRam = asyncHandler(async (req, res, next) => {
//   const { productId } = req.params;

//   if (!productId) {
//     return next(new ApiError(400, "Product id is required"));
//   }

//   const findedRam = await Product.findById(productId).populate([
//     {
//       path: "reviews",
//       select: "rating review user createdAt",
//       populate: {
//         path: "user",
//         select: "name email avatar",
//       },
//     },
//   ]);

//   if (!findedRam) {
//     return next(new ApiError(404, "Product not found"));
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Product fetched successfully",
//     data: findedRam,
//   });
// });

export const UpdateRam = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const productId = req.params.productId;

  const { error } = validateRam(req.body);
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
    manufacturer,
    ramType,
    ramSize,
    latency,
    cacheLatency,
    module,
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
    product.manufacturer === manufacturer &&
    product.ramType === ramType &&
    product.ramSize === ramSize &&
    product.latency === latency &&
    product.cacheLatency === cacheLatency &&
    product.module === module;

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

  const updatedRam = await Product.findByIdAndUpdate(
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
      manufacturer,
      ramType,
      ramSize,
      latency,
      cacheLatency,
      module,
    },
    { new: true }
  );

  if (!updatedRam) {
    return next(new ApiError(500, "Something went wrong while updating Ram"));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedRam,
  });
});

export const RemoveRamById = asyncHandler(async (req, res, next) => {
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

function validateRam(data) {
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
        "Ram",
        "Ram",
        "Prebuild",
        "Ram",
        "Cooler",
        "Psu",
        "Storage",
        "Case",
        "Motherboard"
      )
      .required(),
    manufacturer: Joi.string().required(),
    ramType: Joi.string().required(),
    ramSize: Joi.number().required(),
    latency: Joi.number().required(),
    cacheLatency: Joi.number().required(),
    module: Joi.string().required(),
  });
  return schema.validate(data);
}
