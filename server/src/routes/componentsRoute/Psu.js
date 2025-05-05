import express from "express";
const router = express.Router();
import {
  AddPsu,
  GetAllPsuWithFiltersAndPagination,
  GetAllPsuDropdown,
  // GetSinglePsu,
  UpdatePsu,
  RemovePsuById,
} from "../../controllers/componnetsController/Psu.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddPsu);
router.get("/get-all", GetAllPsuWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllPsuDropdown);
// router.get("/get-single/:productId", GetSinglePsu);
router.put("/update/:productId", isAuthenticated, UpdatePsu);
router.delete("/delete", isAuthenticated, RemovePsuById);

export default router;
