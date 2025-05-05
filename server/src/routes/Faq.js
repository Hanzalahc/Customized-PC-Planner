import express from "express";
import { addFaq, getFaqs } from "../controllers/Faq.js";
const router = express.Router();

router.get("/get", getFaqs);
router.post("/add", addFaq);

export default router;
