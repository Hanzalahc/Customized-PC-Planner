import express from "express";
const router = express.Router();
import {
  AddStorage,
  GetAllStorageWithFiltersAndPagination,
  GetAllStorageDropdown,
  // GetSingleStorage,
  UpdateStorage,
  RemoveStorageById,
} from "../../controllers/componnetsController/Storage.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddStorage);
router.get("/get-all", GetAllStorageWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllStorageDropdown);
// router.get("/get-single/:productId", GetSingleStorage);
router.put("/update/:productId", isAuthenticated, UpdateStorage);
router.delete("/delete", isAuthenticated, RemoveStorageById);

export default router;
