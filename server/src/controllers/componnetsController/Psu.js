// import Category from "../../models/PreBuildCategory.js";
import Product from "../../models/Product.js";
import Psu from "../../models/componentsModel/Psu.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import Joi from "joi";
import { deleteImageFromCloudinary } from "../../utils/cloudinary.js";

export const AddPsu = asyncHandler(async (req, res, next) => {
  const userData = req?.user;

  if (userData?.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const { error } = validatePsu(req.body);
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
    powerSupplyType,
    efficiencyRating,
    modularType,
  } = req.body;

  const duplicateProduct = await Product.findOne({
    name,
    productType,
    model,
  });

  if (duplicateProduct) {
    return next(new ApiError(409, "Product already exists with this name"));
  }

  const newPsu = new Psu({
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
    powerSupplyType,
    efficiencyRating,
    modularType,
  });

  const savedPsu = await newPsu.save();

  if (!savedPsu) {
    return next(new ApiError(500, "Something went wrong while saving Psu"));
  }

  res.status(201).json({
    message: "Psu created successfully",
    success: true,
    data: savedPsu,
  });
});

export const GetAllPsuWithFiltersAndPagination = asyncHandler(
  async (req, res, next) => {
    const pageNum =
      Number(req.query.data.pageNum) > 0 ? Number(req.query.pageNum) : 1;
    const pageSize = 10;

    const filters = {
      status: "active",
      productType: "Psu",
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

    if (req.query.data.powerSupplyType) {
      filters.powerSupplyType = req.query.data.powerSupplyType;
    }

    if (req.query.data.efficiencyRating) {
      filters.efficiencyRating = req.query.data.efficiencyRating;
    }

    if (req.query.data.modularType) {
      filters.modularType = req.query.data.modularType;
    }
    const sortOrder = req.query.data?.price === "low" ? 1 : -1;

    const allPsus = await Product.find(filters)
      .select(" images name description price oldPrice discount rating ")
      .sort(req.query.data?.price ? { price: sortOrder } : {})
      .skip((pageNum - 1) * pageSize)

      .limit(pageSize);

    if (!allPsus || allPsus.length === 0) {
      return next(new ApiError(404, "No Psus found"));
    }

    const totalPsus = await Product.countDocuments(filters);

    const totalPages = Math.ceil(totalPsus / pageSize);

    res.status(200).json({
      success: true,
      message: "All Psus fetched successfully",
      data: {
        psus: allPsus,
        totalPages: totalPages,
        totalItems: totalPsus,
      },
    });
  }
);

export const GetAllPsuDropdown = asyncHandler(async (req, res, next) => {
  const allPsus = await Product.find({
    status: "active",
    productType: "Psu",
  }).select(
    " images name description price oldPrice model discount rating benchmark"
  );

  if (!allPsus || allPsus.length === 0) {
    return next(new ApiError(404, "No Psus found"));
  }

  const totalPsus = allPsus.length;

  res.status(200).json({
    success: true,
    message: "All Psus fetched successfully",
    data: {
      psus: allPsus,
      totalPsus,
    },
  });
});

// export const GetSinglePsu = asyncHandler(async (req, res, next) => {
//   const { productId } = req.params;

//   if (!productId) {
//     return next(new ApiError(400, "Product id is required"));
//   }

//   const findedPsu = await Product.findById(productId).populate([
//     {
//       path: "reviews",
//       select: "rating review user createdAt",
//       populate: {
//         path: "user",
//         select: "name email avatar",
//       },
//     },
//   ]);

//   if (!findedPsu) {
//     return next(new ApiError(404, "Product not found"));
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Product fetched successfully",
//     data: findedPsu,
//   });
// });

export const UpdatePsu = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const productId = req.params.productId;

  const { error } = validatePsu(req.body);
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
    benchmark,
    vRam,
    memoryType,
    interfaceType,
    tdp,
    hdmiPorts,
    displayPorts,
    dviPorts,
    memoryInterface,
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
    product.benchmark === benchmark &&
    product.vRam === vRam &&
    product.memoryType === memoryType &&
    product.interfaceType === interfaceType &&
    product.tdp === tdp &&
    product.hdmiPorts === hdmiPorts &&
    product.displayPorts === displayPorts &&
    product.dviPorts === dviPorts &&
    product.memoryInterface === memoryInterface;

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

  const updatedPsu = await Product.findByIdAndUpdate(
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
      vRam,
      memoryType,
      interfaceType,
      tdp,
      hdmiPorts,
      displayPorts,
      dviPorts,
      memoryInterface,
      benchmark,
    },
    { new: true }
  );

  if (!updatedPsu) {
    return next(new ApiError(500, "Something went wrong while updating Psu"));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedPsu,
  });
});

export const RemovePsuById = asyncHandler(async (req, res, next) => {
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

function validatePsu(data) {
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
        "Psu",
        "Ram",
        "Prebuild",
        "Psu",
        "Cooler",
        "Psu",
        "Storage",
        "Case",
        "Motherboard"
      )
      .required(),
    manufacturer: Joi.string().required(),
    powerSupplyType: Joi.string().required(),
    efficiencyRating: Joi.string().required(),
    modularType: Joi.string().required(),
  });
  return schema.validate(data);
}
