import express from "express";
import Stripe from "stripe";
import Product from "../models/Product.js";
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe Payment API
router.post("/pay", async (req, res) => {
  try {
    const { amount, products, email, id } = req.body;
    const amountInCents = amount * 100;
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "pkr",
        product_data: {
          name: product.name,
          images: product.images?.length ? [product.images[0].url] : [],
        },
        unit_amount: Math.round(product.price * 100),
      },

      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CORS_ORIGIN}/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CORS_ORIGIN}/order-failed`,
      customer_email: email,
    });

    // situation can arrive that customer requested stripe session and during payment another customer already purchased  the remaining stock of product so we have to reserve the stock for the customer who requested the stripe session and handle it accordingly

    // check if stock is available
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findById(products[i]._id);
      if (product.stock < products[i].quantity || product.stock === 0) {
        return next(
          new ApiError(
            400,
            `Stock not available for ${product.name.substring(0, 20)}, available stock is ${product.stock}`
          )
        );
      }
    }

    // now we can reserve the stock for the customer who requested the stripe session
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findById(products[i]._id);
      product.stock -= products[i].quantity;
      await product.save();
    }

    res.json({ success: true, session, stockReserved: true });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  const { session_id } = req.query;
  const { stockReserved, products } = req.body;
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      // if stock was reserved for the customer who requested the stripe session and session is not found then we have to revert the stock back to the product
      if (stockReserved) {
        for (let i = 0; i < products.length; i++) {
          const product = await Product.findById(products[i]._id);
          product.stock += products[i].quantity;
          await product.save();
        }
      }

      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.json({
      success: true,
      paymentStatus: session.payment_status,
      paymentId: session.payment_intent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

export default router;
