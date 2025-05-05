// import Category from "../../models/PreBuildCategory.js";
import Product from "../../models/Product.js";
import Case from "../../models/componentsModel/Case.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import Joi from "joi";
import { deleteImageFromCloudinary } from "../../utils/cloudinary.js";

export const AddCase = asyncHandler(async (req, res, next) => {
  const userData = req?.user;

  if (userData?.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const { error } = validateCase(req.body);
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
    sidePanel,
    frontPanel,
    formFactor,
    videoCardLength,
  } = req.body;

  const duplicateProduct = await Product.findOne({
    name,
    productType,
    model,
  });

  if (duplicateProduct) {
    return next(new ApiError(409, "Product already exists with this name"));
  }

  const newCase = new Case({
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
    sidePanel,
    frontPanel,
    formFactor,
    videoCardLength,
  });

  const savedCase = await newCase.save();

  if (!savedCase) {
    return next(new ApiError(500, "Something went wrong while saving CASE"));
  }

  res.status(201).json({
    message: "Case created successfully",
    success: true,
    data: savedCase,
  });
});

export const GetAllCaseWithFiltersAndPagination = asyncHandler(
  async (req, res, next) => {
    const pageNum =
      Number(req.query.data.pageNum) > 0 ? Number(req.query.pageNum) : 1;
    const pageSize = 10;

    const filters = {
      status: "active",
      productType: "Case",
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

    if (req.query.data.sidePanel) {
      filters.sidePanel = req.query.data.sidePanel;
    }

    if (req.query.data.frontPanel) {
      filters.frontPanel = req.query.data.frontPanel;
    }

    if (req.query.data.formFactor) {
      filters.formFactor = req.query.data.formFactor;
    }
    const sortOrder = req.query.data?.price === "low" ? 1 : -1;

    const allCases = await Product.find(filters)

      .select(" images name description price oldPrice discount rating ")
      .sort(req.query.data?.price ? { price: sortOrder } : {})
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);

    if (!allCases || allCases.length === 0) {
      return next(new ApiError(404, "No CASEs found"));
    }

    const totalCases = await Product.countDocuments(filters);

    const totalPages = Math.ceil(totalCases / pageSize);

    res.status(200).json({
      success: true,
      message: "All CASEs fetched successfully",
      data: {
        cases: allCases,
        totalPages: totalPages,
        totalItems: totalCases,
      },
    });
  }
);

export const GetAllCaseDropdown = asyncHandler(async (req, res, next) => {
  const allCases = await Product.find({
    status: "active",
    productType: "Case",
  }).select(
    " images name description price oldPrice discount rating formFactor model"
  );

  if (!allCases || allCases.length === 0) {
    return next(new ApiError(404, "No CASEs found"));
  }

  const totalCases = allCases.length;

  res.status(200).json({
    success: true,
    message: "All CASEs fetched successfully",
    data: {
      cases: allCases,
      totalCases,
    },
  });
});

// export const GetSingleCase = asyncHandler(async (req, res, next) => {
//   const { productId } = req.params;

//   if (!productId) {
//     return next(new ApiError(400, "Product id is required"));
//   }

//   const findedCase = await Product.findById(productId).populate([
//     {
//       path: "reviews",
//       select: "rating review user createdAt",
//       populate: {
//         path: "user",
//         select: "name email avatar",
//       },
//     },
//   ]);

//   if (!findedCase) {
//     return next(new ApiError(404, "Product not found"));
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Product fetched successfully",
//     data: findedCase,
//   });
// });

export const UpdateCase = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const productId = req.params.productId;

  const { error } = validateCase(req.body);
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
    sidePanel,
    frontPanel,
    formFactor,
    videoCardLength,
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
    product.sidePanel === sidePanel &&
    product.frontPanel === frontPanel &&
    product.formFactor === formFactor &&
    product.videoCardLength === videoCardLength;

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

  const updatedCase = await Product.findByIdAndUpdate(
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
      sidePanel,
      frontPanel,
      formFactor,
      videoCardLength,
    },
    { new: true }
  );

  if (!updatedCase) {
    return next(new ApiError(500, "Something went wrong while updating CASE"));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedCase,
  });
});

export const RemoveCaseById = asyncHandler(async (req, res, next) => {
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

function validateCase(data) {
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
        "Case",
        "Ram",
        "Prebuild",
        "Case",
        "Cooler",
        "Psu",
        "Storage",
        "Case",
        "Motherboard"
      )
      .required(),
    manufacturer: Joi.string().required(),
    sidePanel: Joi.string().required(),
    frontPanel: Joi.string().required(),
    formFactor: Joi.string().required(),
    videoCardLength: Joi.number().min(150).max(635).required(),
  });
  return schema.validate(data);
}
