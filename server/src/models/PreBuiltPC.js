import mongoose from "mongoose";
import Product from "./Product.js";

const preBuiltSchema = new mongoose.Schema({
  components: {
    cpu: { type: mongoose.Schema.Types.ObjectId, ref: "Cpu", required: true },
    gpu: { type: mongoose.Schema.Types.ObjectId, ref: "Gpu", required: true },
    ram: { type: mongoose.Schema.Types.ObjectId, ref: "Ram", required: true },
    storage: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Storage", required: true },
    ],
    psu: { type: mongoose.Schema.Types.ObjectId, ref: "Psu", required: true },
    motherboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Motherboard",
      required: true,
    },
    airCooler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cooler",
      required: true,
    },
    gamingCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PreBuildCategory",
    required: true,
  },

  hasUpgradeOptions: {
    type: Boolean,
    default: false,
  },
  upgradeOptions: {
    type: [],
    default: [],
  },
});

export default Product.discriminator("Prebuild", preBuiltSchema);
