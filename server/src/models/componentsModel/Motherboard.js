import mongoose from "mongoose";
import Product from "../Product.js";

const motherboardSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    enum: [
      "ASRock",
      "ASUS",
      "Colorful",
      "EVGA",
      "Gigabyte",
      "MSI",
      "NZXT",
      "Sapphire",
      "Zotac",
      "Biostar",
    ],
    required: true,
  },
  socket: {
    type: String,
    enum: [
      "AM1",
      "AM2",
      "AM3",
      "AM4",
      "AM5",
      "LGA 775",
      "LGA 1150",
      "LGA 1151",
      "LGA 1155",
      "LGA 1156",
      "LGA 1200",
      "LGA 1366",
      "LGA 1700",
      "LGA 1851",
      "LGA 2011",
      "LGA 2066",
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
  memoryType: {
    type: String,
    enum: ["DDR2", "DDR3", "DDR4", "DDR5"],
    required: true,
  },
  memorySlots: {
    type: Number,
    min: 1,
    max: 16,
    required: true,
  },

  pcieSlots: {
    type: Number,
    min: 0,
    max: 6,
    required: true,
  },

  sataM2Slots: {
    type: Number,
    min: 0,
    max: 7,
    required: true,
  },
});

export default Product.discriminator("Motherboard", motherboardSchema);
