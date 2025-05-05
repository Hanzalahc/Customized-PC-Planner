import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: process.env.CLOUDINARY_FOLDER,
      resource_type: "auto",
      transformation: [
        {
          width: 800,
          height: 800,
          crop: "limit",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    });

    // Remove the local file
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    // Safely remove the local file if it exists
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    return null;
  }
};

// Delete from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    // console.log("Cloudinary file deleted:", response);
    return response;
  } catch (error) {
    console.error("Cloudinary deletion failed:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteImageFromCloudinary };
