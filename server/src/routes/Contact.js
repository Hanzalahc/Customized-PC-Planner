import express from "express";
import { SubmitForm } from "../controllers/Contact.js";
const router = express.Router();

router.post("/submit", SubmitForm);

export default router;
