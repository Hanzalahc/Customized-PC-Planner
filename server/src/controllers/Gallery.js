import Gallery from "../models/Gallery.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const uploadImage = asyncHandler(async (req, res, next) => {
  // console.log("req files:", req.file);

  // req files: {
  //   fieldname: 'image',
  //   originalname: 'Screenshot (2).png',
  //   encoding: '7bit',
  //   mimetype: 'image/png',
  //   destination: './public/temp',
  //   filename: 'Screenshot (2)-1733394090451-852793139.png',
  //   path: 'public\\temp\\Screenshot (2)-1733394090451-852793139.png',
  //   size: 130563
  // }

  const imagePath = req.file?.path;

  if (!req.file || !imagePath) {
    return next(new ApiError(400, "No file uploaded"));
  }

  const cloudinaryResult = await uploadOnCloudinary(imagePath);

  if (!cloudinaryResult) {
    return next(new ApiError(500, "Failed to upload image to Cloudinary"));
  }

  // console.log("Cloudnary res:",cloudinaryResult )

  // Cloudnary res: {
  //   asset_id: '45dd9f7b61b8b970a84b5d47478804d3',
  //   public_id: 'template/na07kvjoleauzcg6ameg',
  //   version: 1733394239,
  //   version_id: '1b234234c9b808e44f31b13551a0640b',
  //   signature: 'd34dd87843d904da514545276297d8154253d72a',
  //   width: 800,
  //   height: 450,
  //   format: 'png',
  //   resource_type: 'image',
  //   created_at: '2024-12-05T10:23:59Z',
  //   tags: [],
  //   bytes: 35250,
  //   type: 'upload',
  //   etag: '1311560f055eaad8b803e146c935b819',
  //   placeholder: false,
  //   url: 'http://res.cloudinary.com/dpqedkhuz/image/upload/v1733394239/template/na07kvjoleauzcg6ameg.png',
  //   secure_url: 'https://res.cloudinary.com/dpqedkhuz/image/upload/v1733394239/template/na07kvjoleauzcg6ameg.png',
  //   asset_folder: 'template',
  //   display_name: 'na07kvjoleauzcg6ameg',
  //   original_filename: 'Screenshot (2)-1733394236143-310164916',
  //   api_key: '232655374279618'
  // }

  const Image = {
    image: {
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
    },
  };

  res.status(201).json({
    success: true,
    message: "Image uploaded successfully!",
    image: Image,
  });
});
