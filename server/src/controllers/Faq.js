import Joi from "joi";
import Faq from "../models/Faq.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const getFaqs = asyncHandler(async (req, res, next) => {
  const faqs = await Faq.find().sort({ createdAt: -1 }).limit(8);
  res.status(200).json({
    message: "Faq get successfully",
    status: true,
    faqs,
  });
});

export const addFaq = asyncHandler(async (req, res, next) => {
  const schema = Joi.object({
    question: Joi.string().required().min(10),
    answer: Joi.string().required().min(10),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new ApiError(error.details[0].message, 400));
  }
  const faq = await Faq.create(req.body);
  res.status(201).json({
    message: "Faq added successfully",
    status: true,
    faq: {
      ...faq._doc,
    },
  });
});
