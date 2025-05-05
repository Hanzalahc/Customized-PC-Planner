import express from "express";
const router = express.Router();
import {
  AddCpu,
  GetAllCpuWithFiltersAndPagination,
  GetAllCpuDropdown,
  // GetSingleCpu,
  UpdateCpu,
  RemoveCpuById,
} from "../../controllers/componnetsController/Cpu.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddCpu);
router.get("/get-all", GetAllCpuWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllCpuDropdown);
// router.get("/get-single/:productId", GetSingleCpu);
router.put("/update/:productId", isAuthenticated, UpdateCpu);
router.delete("/delete", isAuthenticated, RemoveCpuById);

export default router;
