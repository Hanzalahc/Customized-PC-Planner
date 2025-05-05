import express from "express";
const router = express.Router();
import {
  AddCase,
  GetAllCaseWithFiltersAndPagination,
  GetAllCaseDropdown,
  // GetSingleCase,
  UpdateCase,
  RemoveCaseById,
} from "../../controllers/componnetsController/Case.js";
import { isAuthenticated } from "../../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddCase);
router.get("/get-all", GetAllCaseWithFiltersAndPagination);
router.get("/get-all-dropdown", GetAllCaseDropdown);
// router.get("/get-single/:productId", GetSingleCase);
router.put("/update/:productId", isAuthenticated, UpdateCase);
router.delete("/delete", isAuthenticated, RemoveCaseById);

export default router;
