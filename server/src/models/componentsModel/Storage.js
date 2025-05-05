import mongoose from "mongoose";
import Product from "../Product.js";

const storageSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    enum: [
      "ADATA",
      "ASUS",
      "CORSAIR",
      "CRUSHER",
      "PHANTOM",
      "G-SKILL",
      "GAMESTOP",
      "INTEL",
      "LEXER",
      "KINGSTON",
      "MSI",
      "SAMSUNG",
      "SONY",
      "T-GROUP",
      "XPG",
      "ZOTAC",
      "WD",
      "NETAC",
    ],
    required: true,
  },

  storageType: {
    type: String,
    enum: ["HDD", "SSD", "NVME"],
    required: true,
  },
  capacity: {
    type: Number,
    min: 128, // GB
    required: true,
  },
  readSpeed: {
    type: Number, // MB/s
    required: true,
  },
  writeSpeed: {
    type: Number, // MB/s
    required: true,
  },
});

export default Product.discriminator("Storage", storageSchema);
