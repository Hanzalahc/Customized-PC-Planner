import mongoose from "mongoose";
import Product from "../Product.js";

const cpuSchema = new mongoose.Schema({
  manufacturor: {
    type: String,
    required: true,
    enum: ["Intel", "AMD"],
  },

  coreCount: {
    type: Number,
    min: 1,
    max: 64,
    required: true,
  },
  performanceCoreFrequency: {
    type: Number,
    min: 0.1, // GHz
    required: true,
  },
  threadCount: {
    type: Number,
    min: 1,
    required: true,
  },
  l2Cache: {
    type: Number,
    min: 0.25, // MB
    default: 0,
  },
  l3Cache: {
    type: Number,
    min: 0,
    default: 0,
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
  },
  stockCooler: {
    type: Boolean,
    default: false,
  },
  benchmark: {
    type: Number,
    required: true,
  },
});

export default Product.discriminator("Cpu", cpuSchema);
