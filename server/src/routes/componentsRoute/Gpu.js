import express from "express";
const router = express.Router();
import {
  AddGpu,
  GetAllGpuWithFiltersAndPagination,
  GetAllGpuDropdown,
  // GetSingleGpu,
  UpdateGpu,
  RemoveGpuById,
} from "../../controllers/componnetsController/Gpu.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddGpu);
router.get("/get-all", GetAllGpuWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllGpuDropdown);
// router.get("/get-single/:productId", GetSingleGpu);
router.put("/update/:productId", isAuthenticated, UpdateGpu);
router.delete("/delete", isAuthenticated, RemoveGpuById);

export default router;
