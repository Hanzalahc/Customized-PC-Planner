import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuth.js";
import {
  addAddress,
  getUserAllAddress,
  deleteAddress,
} from "../controllers/Address.js";

router.post("/add", isAuthenticated, addAddress);
router.get("/all", isAuthenticated, getUserAllAddress);
router.delete("/delete", isAuthenticated, deleteAddress);

export default router;
