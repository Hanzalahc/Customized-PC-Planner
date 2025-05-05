import express from "express";
const router = express.Router();
import {
  AddCooler,
  GetAllCoolerWithFiltersAndPagination,
  GetAllCoolerDropdown,
  // GetSingleCooler,
  UpdateCooler,
  RemoveCoolerById,
} from "../../controllers/componnetsController/Cooler.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddCooler);
router.get("/get-all", GetAllCoolerWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllCoolerDropdown);
// router.get("/get-single/:productId", GetSingleCooler);
router.put("/update/:productId", isAuthenticated, UpdateCooler);
router.delete("/delete", isAuthenticated, RemoveCoolerById);

export default router;
