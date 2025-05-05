import ContactForm from "../models/Contact.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendContactSubmitMail } from "../utils/sendMail.js";

export const SubmitForm = asyncHandler(async (req, res, next) => {
  const { name, email, message } = req.body;

  const newContact = new ContactForm({
    name,
    email,
    message,
  });

  const savedContact = await newContact.save();
  sendContactSubmitMail(email, name);

  res.status(201).json({
    message: "Form Submitted Successfully",
    status: true,
  });
});
