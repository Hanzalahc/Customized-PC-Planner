import mongoose from "mongoose";
import Product from "../Product.js";

const ramSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    enum: [
      "Acer",
      "ADATA",
      "AMD",
      "Antec",
      "Corsair",
      "EVGA",
      "G.Skill",
      "Gigabyte",
      "Kingston",
      "Lexar",
      "Samsung",
      "V-Color",
      "XPG",
    ],
    required: true,
  },

  ramType: {
    type: String,
    enum: ["DDR2", "DDR3", "DDR4", "DDR5"],
    required: true,
  },
  ramSize: {
    type: Number,
    min: 1,
    max: 256,
    required: true,
  },
  
  latency: {
    type: Number,
    min: 6,
    required: true,
  },
  cacheLatency: {
    type: Number,
    min: 2.5,
    max: 52,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
});

export default Product.discriminator("Ram", ramSchema);
