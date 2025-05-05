// import Category from "../../models/PreBuildCategory.js";
import Product from "../../models/Product.js";
import Gpu from "../../models/componentsModel/Gpu.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import Joi from "joi";
import { deleteImageFromCloudinary } from "../../utils/cloudinary.js";

export const AddGpu = asyncHandler(async (req, res, next) => {
  const userData = req?.user;

  if (userData?.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const { error } = validateGpu(req.body);
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

  const duplicateProduct = await Product.findOne({
    name,
    productType,
    model,
  });

  if (duplicateProduct) {
    return next(new ApiError(409, "Product already exists with this name"));
  }

  const newGpu = new Gpu({
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
    vRam,
    memoryType,
    interfaceType,
    tdp,
    hdmiPorts,
    displayPorts,
    dviPorts,
    memoryInterface,
    benchmark,
  });

  const savedGpu = await newGpu.save();

  if (!savedGpu) {
    return next(new ApiError(500, "Something went wrong while saving GPU"));
  }

  res.status(201).json({
    message: "Gpu created successfully",
    success: true,
    data: savedGpu,
  });
});

export const GetAllGpuWithFiltersAndPagination = asyncHandler(
  async (req, res, next) => {
    const pageNum =
      Number(req.query.data.pageNum) > 0 ? Number(req.query.pageNum) : 1;
    const pageSize = 10;

    const filters = {
      status: "active",
      productType: "Gpu",
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

    if (req.query.data.memoryType) {
      filters.memoryType = req.query.data.memoryType;
    }

    if (req.query.data.memoryInterface) {
      filters.memoryInterface = req.query.data.memoryInterface;
    }
    const sortOrder = req.query.data?.price === "low" ? 1 : -1;

    const allGpus = await Product.find(filters)
      .select(" images name description price oldPrice discount rating ")
      .sort(req.query.data?.price ? { price: sortOrder } : {})
      .skip((pageNum - 1) * pageSize)

      .limit(pageSize);

    if (!allGpus || allGpus.length === 0) {
      return next(new ApiError(404, "No GPUs found"));
    }

    const totalGpus = await Product.countDocuments(filters);

    const totalPages = Math.ceil(totalGpus / pageSize);

    res.status(200).json({
      success: true,
      message: "All GPUs fetched successfully",
      data: {
        gpus: allGpus,
        totalPages: totalPages,
        totalItems: totalGpus,
      },
    });
  }
);

export const GetAllGpuDropdown = asyncHandler(async (req, res, next) => {
  const allGpus = await Product.find({
    status: "active",
    productType: "Gpu",
  }).select(
    " images name description price oldPrice discount rating benchmark model"
  );

  if (!allGpus || allGpus.length === 0) {
    return next(new ApiError(404, "No GPUs found"));
  }

  const totalGpus = allGpus.length;

  res.status(200).json({
    success: true,
    message: "All GPUs fetched successfully",
    data: {
      gpus: allGpus,
      totalGpus,
    },
  });
});

// export const GetSingleGpu = asyncHandler(async (req, res, next) => {
//   const { productId } = req.params;

//   if (!productId) {
//     return next(new ApiError(400, "Product id is required"));
//   }

//   const findedGpu = await Product.findById(productId).populate([
//     {
//       path: "reviews",
//       select: "rating review user createdAt",
//       populate: {
//         path: "user",
//         select: "name email avatar",
//       },
//     },
//   ]);

//   if (!findedGpu) {
//     return next(new ApiError(404, "Product not found"));
//   }

//   return res.status(200).json({
//     success: true,
//     message: "Product fetched successfully",
//     data: findedGpu,
//   });
// });

export const UpdateGpu = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  const productId = req.params.productId;

  const { error } = validateGpu(req.body);
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

  const updatedGpu = await Product.findByIdAndUpdate(
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

  if (!updatedGpu) {
    return next(new ApiError(500, "Something went wrong while updating GPU"));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedGpu,
  });
});

export const RemoveGpuById = asyncHandler(async (req, res, next) => {
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

function validateGpu(data) {
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
        "Gpu",
        "Ram",
        "Prebuild",
        "Gpu",
        "Cooler",
        "Psu",
        "Storage",
        "Case",
        "Motherboard"
      )
      .required(),
    manufacturer: Joi.string().required(),
    benchmark: Joi.number().min(0).required(),
    vRam: Joi.number().min(1).required(),
    memoryType: Joi.string()
      .valid("DDR4", "DDR5", "GDDR5", "GDDR5X", "GDDR6", "GDDR6X")
      .required(),
    interfaceType: Joi.string()
      .valid("PCI", "PCIE X1", "PCIE X8", "PCIE X16", "AGP")
      .required(),
    tdp: Joi.number().min(15).max(580).required(),
    hdmiPorts: Joi.number().min(0).required(),
    displayPorts: Joi.number().min(0).required(),
    dviPorts: Joi.number().min(0).required(),
    memoryInterface: Joi.number().valid(128, 192, 256).required(),
  });
  return schema.validate(data);
}
