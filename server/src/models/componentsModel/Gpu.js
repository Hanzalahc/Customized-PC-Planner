import mongoose from "mongoose";
import Product from "../Product.js";

const gpuSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    enum: [
      "Asus",
      "MSI",
      "Evga",
      "Gigabyte",
      "Asrock",
      "Colorful",
      "Sapphire",
      "Nvidia",
      "Galaxy",
      "Zotac",
      "PowerColor",
      "Palit",
      "XFX",
      "Inno3D",
      "PNY",
      "VisionTek",
      "Gainward",
      "Leadtek",
    ],
    required: true,
  },

  benchmark: {
    type: Number,
    required: true,
  },

  vRam: {
    type: Number,
    required: true,
    min: 1, // GB
  },
  memoryType: {
    type: String,
    enum: ["DDR4", "DDR5", "GDDR5", "GDDR5X", "GDDR6", "GDDR6X"],
    required: true,
  },
  interfaceType: {
    type: String,
    enum: ["PCI", "PCIE X1", "PCIE X8", "PCIE X16", "AGP"],
    required: true,
  },

  tdp: {
    type: Number,
    required: true,
    min: 15, // Watt
    max: 580, // Watt
  },
  hdmiPorts: {
    type: Number,
    required: true,
    min: 0,
  },
  displayPorts: {
    type: Number,
    required: true,
    min: 0,
  },
  dviPorts: {
    type: Number,
    required: true,
    min: 0,
  },
  memoryInterface: {
    type: Number,
    required: true,
    enum: [128, 192, 256], // Bit Bus
  },
});

export default Product.discriminator("Gpu", gpuSchema);
