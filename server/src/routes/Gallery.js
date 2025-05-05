import express from "express";
const router = express.Router();
import { uploadImage } from "../controllers/Gallery.js";
import { multerFileUpload } from "../middlewares/multerFile.js";

router.post("/upload", multerFileUpload.single("image"), uploadImage);

export default router;
