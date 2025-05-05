import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);

    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});
const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB
};

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Image type should be png, jpeg, jpg, or webp"), false);
  }
};

export const multerFileUpload = multer({
  storage,
  limits,
  fileFilter,
});
