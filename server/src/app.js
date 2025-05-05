import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/errorHandler.js";

const app = express();

// defaults middlweares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// importing main routes
import userRoutes from "./routes/User.js";
import contactRoutes from "./routes/Contact.js";
import GalleryRoute from "./routes/Gallery.js";
import PreBuildCategoryRoutes from "./routes/PreBuildCategory.js";
import Faq from "./routes/Faq.js";
import AddressRoutes from "./routes/Address.js";
import ReviewRoutes from "./routes/Review.js";
import OrderRoutes from "./routes/Order.js";
import StripePaymentRoute from "./routes/StripePayment.js";
import StatsRoute from "./routes/Stats.js";
import ProductRoute from "./routes/Product.js";

// components routes used by product model
import CpuRoute from "./routes/componentsRoute/Cpu.js";
import GpuRoute from "./routes/componentsRoute/Gpu.js";
import RamRoute from "./routes/componentsRoute/Ram.js";
import StorageRoute from "./routes/componentsRoute/Storage.js";
import PsuRoute from "./routes/componentsRoute/Psu.js";
import MotherboardRoute from "./routes/componentsRoute/Motherboard.js";
import CaseRoute from "./routes/componentsRoute/Case.js";
import CoolerRoute from "./routes/componentsRoute/Cooler.js";
import PrebuildRoute from "./routes/Prebuild.js";

// routes
app.use("/user", userRoutes);
app.use("/contact", contactRoutes);
app.use("/gallery", GalleryRoute);
app.use("/prebuildcategory", PreBuildCategoryRoutes);
app.use("/faq", Faq);
app.use("/address", AddressRoutes);
app.use("/review", ReviewRoutes);
app.use("/order", OrderRoutes);
app.use("/stripe", StripePaymentRoute);
app.use("/stats", StatsRoute);
app.use("/product", ProductRoute);

// components routes
app.use("/cpu", CpuRoute);
app.use("/gpu", GpuRoute);
app.use("/ram", RamRoute);
app.use("/storage", StorageRoute);
app.use("/psu", PsuRoute);
app.use("/motherboard", MotherboardRoute);
app.use("/case", CaseRoute);
app.use("/cooler", CoolerRoute);
app.use("/prebuild", PrebuildRoute);

// / Error handler middleware
app.use(errorHandler);

export default app;
