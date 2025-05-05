import express from "express";
import { addNewCategory } from "../controllers/PreBuildCategory.js";
const router = express.Router();

router.post("/add", addNewCategory);

export default router;
