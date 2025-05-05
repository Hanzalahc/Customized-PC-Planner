import express from "express";
const router = express.Router();
import {
  GetSingleProduct,
  search,
  getAllProductsForAdmin,
  getProductsByProductType,
  deleteProduct,
  deleteMultipleProducts,
  getProductsByStatus,
  getPrebuildProductsByCategory,
} from "../controllers/Product.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

router.get("/get-single/:productId", GetSingleProduct);
router.get("/search", search);
router.get("/get-all", getAllProductsForAdmin);
router.get("/get-by-category/:productType", getProductsByProductType);
router.delete("/delete", isAuthenticated, deleteProduct);
router.delete("/delete-multiple", isAuthenticated, deleteMultipleProducts);
router.get("/get-by-status/:status", getProductsByStatus);
router.get("/get-prebuild-by-category/:categoryId", getPrebuildProductsByCategory);

export default router;
