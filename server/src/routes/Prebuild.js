import express from "express";
const router = express.Router();
import {
  AddPrebuild,
  GetAllPrebuildDropdown,
  // GetSinglePrebuild,
  UpdatePrebuild,
  RemovePrebuildById,
} from "../controllers/Prebuild.js";
import { isAuthenticated } from "../middlewares/isAuth.js";

router.post("/add", isAuthenticated, AddPrebuild);
router.get("/get-all-dropdown", GetAllPrebuildDropdown);
// router.get("/get-single/:productId", GetSinglePrebuild);
router.put("/update/:productId", isAuthenticated, UpdatePrebuild);
router.delete("/delete", isAuthenticated, RemovePrebuildById);

export default router;
