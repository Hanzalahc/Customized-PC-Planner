import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    email: {
      type: String,
      required: true,
      trim: true, 
      lowercase: true, 
    },
    message: {
      type: String,
      required: true,
      trim: true, 
    },
  },
  { timestamps: true } 
);

export default mongoose.model("ContactForm", contactFormSchema);
