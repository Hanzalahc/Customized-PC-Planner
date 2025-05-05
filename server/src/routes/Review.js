import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuth.js";

import { addReview, getReviewsForUser } from "../controllers/Review.js";

router.post("/add/:productId", isAuthenticated, addReview);
router.get("/user", isAuthenticated, getReviewsForUser);

export default router;
