import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 10,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 10,
  },
});

export default mongoose.model("Faq", FaqSchema);
