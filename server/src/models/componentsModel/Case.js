import mongoose from "mongoose";
import Product from "../Product.js";

const caseSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    enum: [
      "ABS",
      "Acer",
      "ADATA",
      "Aerocool",
      "APEX",
      "ASUS",
      "Be Quiet",
      "Casecom",
      "Circle",
      "Corsair",
      "Dark Flash",
      "Deepcool",
      "EVGA",
      "G.Skill",
      "Gigabyte",
      "Thunder",
      "MSI",
      "NZXT",
      "Razer",
      "Sigma",
      "Silverstone",
      "GameMax",
      "Ease",
    ],
    required: true,
  },

  sidePanel: {
    type: String,
    enum: ["Mesh", "Tinted", "Tempered Glass"],
    required: true,
  },
  frontPanel: {
    type: String,
    enum: [
      "USB 3.2, 2 Type-C",
      "USB 3.2, 1 Type-C",
      "USB 3.2, 1 Type-A",
      "USB 2.0",
    ],
    required: true,
  },
  formFactor: {
    type: String,
    enum: [
      "ATX",
      "E-ATX",
      "Flex-ATX",
      "Micro-ATX",
      "Mini-ITX",
      "Thin Mini-ITX",
      "XL-ATX",
    ],
    required: true,
  },
  videoCardLength: {
    type: Number,
    min: 150,
    max: 635,
    default: 0,
  },
});

export default Product.discriminator("Case", caseSchema);
