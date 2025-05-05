import express from "express";
const router = express.Router();
import {
  AddMotherboard,
  GetAllMotherboardWithFiltersAndPagination,
  GetAllMotherboardDropdown,
  // GetSingleMotherboard,
  UpdateMotherboard,
  RemoveMotherboardById,
} from "../../controllers/componnetsController/Motherboard.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddMotherboard);
router.get("/get-all", GetAllMotherboardWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllMotherboardDropdown);
// router.get("/get-single/:productId", GetSingleMotherboard);
router.put("/update/:productId", isAuthenticated, UpdateMotherboard);
router.delete("/delete", isAuthenticated, RemoveMotherboardById);

export default router;
