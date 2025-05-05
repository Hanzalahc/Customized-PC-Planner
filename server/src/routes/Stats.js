import express from "express";
const router = express.Router();
import { getStats, bottleneckScoreCalculation } from "../controllers/Stats.js";

router.get("/data", getStats);
router.post("/bottleneck", bottleneckScoreCalculation);

export default router;
