import mongoose from "mongoose";
import Product from "../Product.js";

const coolerSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    enum: [
      "ADATA",
      "Aerocool",
      "AMD",
      "Deepcool",
      "Darkflash",
      "EVGA",
      "Evercool",
      "Gigabyte",
      "Intel",
      "Cooler Master",
      "Lian Li",
      "Razer",
      "Sapphire",
      "SilverX",
      "Silverstone",
      "Thermaltake",
      "Ball",
      "Fluid Dynamic",
      "Rifle",
      "Noctua",
      "Sleeve",
      "Aigo",
      "Arctic",
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
  isWaterCooled: {
    type: Boolean,
    default: false,
    required: true,
  },
  isFanless: {
    type: Boolean,
    default: false,
    required: true,
  },
});

export default Product.discriminator("Cooler", coolerSchema);
