import mongoose from "mongoose";
import Product from "../Product.js";

const PSUSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    enum: [
      "Corsair",
      "ADATA",
      "ASUS",
      "Cooler Master",
      "DeepCool",
      "EVGA",
      "G.Skill",
      "Gigabyte",
      "NZXT",
      "Lian Li",
      "MSI",
      "Nexus",
      "Seasonic",
      "Super Flower",
      "Thermaltake",
      "1st Player",
      "XPG",
                  "Ease",
                  "Silver Stone",
    ],
    required: true,
  },
  // PSU specific fields
  powerSupplyType: {
    type: String,
    enum: ["ATX", "Flex ATX", "Mini ITX", "SFX", "TFX"],
    required: true,
  },
  efficiencyRating: {
    type: String,
    enum: [
      "80 Plus Titanium",
      "80 Plus Platinum",
      "80 Plus Gold",
      "80 Plus Silver",
      "80 Plus Bronze",
      "80 Plus",
    ],
    required: true,
  },
  modularType: {
    type: String,
    enum: ["Full", "Semi", "Non-modular"],
    required: true,
  },

});

export default Product.discriminator("Psu", PSUSchema);
