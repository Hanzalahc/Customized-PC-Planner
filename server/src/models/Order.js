import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
          default: "",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "cod"],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: "",
    },

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
