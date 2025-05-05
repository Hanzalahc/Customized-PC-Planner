import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuth.js";
import {
  addOrder,
  getUserOrders,
  getAllOrders,
  filters,
  updateOrderStatus,
} from "../controllers/Order.js";

router.post("/add", isAuthenticated, addOrder);
router.get("/user", isAuthenticated, getUserOrders);
router.get("/all", isAuthenticated, getAllOrders);
router.get("/filters", isAuthenticated, filters);
router.patch("/update-status", isAuthenticated, updateOrderStatus);

export default router;
