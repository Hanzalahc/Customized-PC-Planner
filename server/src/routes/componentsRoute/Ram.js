import express from "express";
const router = express.Router();
import {
  AddRam,
  GetAllRamWithFiltersAndPagination,
  GetAllRamDropdown,
  // GetSingleRam,
  UpdateRam,
  RemoveRamById,
} from "../../controllers/componnetsController/Ram.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddRam);
router.get("/get-all", GetAllRamWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllRamDropdown);
// router.get("/get-single/:productId", GetSingleRam);
router.put("/update/:productId", isAuthenticated, UpdateRam);
router.delete("/delete", isAuthenticated, RemoveRamById);

export default router;
