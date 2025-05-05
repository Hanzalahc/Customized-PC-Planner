import Order from "../models/Order.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import Product from "../models/Product.js";
import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendOrderConfirmationMail } from "../utils/sendMail.js";

export const addOrder = asyncHandler(async (req, res, next) => {
  const { error } = validateOrder(req.body);
  const { stockReserved } = req.body;
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const userData = req.user || {};

  // check if stock is available
  if (!stockReserved) {
    for (let i = 0; i < req.body.products.length; i++) {
      const product = await Product.findById(req.body.products[i].productId);
      if (
        product.stock < req.body.products[i].quantity ||
        product.stock === 0
      ) {
        return next(
          new ApiError(
            400,
            `Stock not available for ${product.name.substring(0, 20)}, available stock is ${product.stock}`
          )
        );
      }
    }
  }

  const order = new Order(req.body);

  await order.save();

  if (!order) {
    return next(new ApiError(500, "Something went wrong while adding order"));
  }

  // push order id to user
  await User.findByIdAndUpdate(
    req.body.userId,
    {
      $push: { orderHistory: order?._id },
    },
    { new: true }
  );

  // decrease each product stock by quantity and increase sale count by quantity
  if (!stockReserved) {
    for (let i = 0; i < req.body.products.length; i++) {
      const product = await Product.findById(req.body.products[i].productId);
      product.stock -= req.body.products[i].quantity;
      product.sale += req.body.products[i].quantity;
      await product.save();
    }
  }

  const address = await Address.findById(req.body.shippingAddress);

  // send order confirmation mail
  await sendOrderConfirmationMail(
    userData?.email,
    userData?.name,
    order?._id,
    order?.products,
    order?.totalAmount,
    order?.paymentStatus,
    address?.addressLine,
    order?.orderStatus
  );

  res.status(201).json({
    success: true,
    message: `Order added successfully, thanks for shopping with us! `,
    data: order,
  });
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  const orders = await Order.find({ userId: userData._id })
    .sort({
      createdAt: -1,
    })
    .populate([
      {
        path: "userId",
        select: "name email mobile",
      },
      {
        path: "shippingAddress",
        select: "addressLine pinCode mobile",
      },
      {
        path: "products.productId",
        select: "name price description brand images",
      },
    ]);

  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;
  const totalOrders = await Order.countDocuments();
  const totalPages = Math.ceil(totalOrders / pageSize);
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .skip(pageSize * pageNum - pageSize)
    .limit(pageSize)
    .populate([
      {
        path: "userId",
        select: "name email mobile",
      },
      {
        path: "shippingAddress",
        select: "addressLine pinCode mobile",
      },
      {
        path: "products.productId",
        select: "name price description brand images",
      },
    ]);

  if (orders.length === 0) {
    return next(new ApiError(404, "No orders found"));
  }

  res.status(200).json({
    success: true,
    message: "All orders fetched successfully",
    data: orders,
    totalPages,
  });
});

export const filters = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  const filters = {};

  if (status) {
    filters.orderStatus = status;
  }

  const totalOrders = await Order.countDocuments(filters);
  const totalPages = Math.ceil(totalOrders / pageSize);
  const orders = await Order.find(filters)
    .sort({ createdAt: -1 })
    .skip(pageSize * pageNum - pageSize)
    .limit(pageSize)
    .populate([
      {
        path: "userId",
        select: "name email mobile",
      },
      {
        path: "shippingAddress",
        select: "addressLine pinCode",
      },
      {
        path: "products.productId",
        select: "name price description brand images",
      },
    ]);

  if (orders.length === 0) {
    return next(new ApiError(404, "No orders found"));
  }

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: orders,
    totalPages,
  });
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id, status } = req.body;

  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  if (!id || !status) {
    return next(new ApiError(400, "Id and status are required"));
  }

  if (status === "delivered") {
    const order = await Order.findById(id);

    if (!order) {
      return next(new ApiError(404, "Order not found"));
    }

    // change paymentStatus of cod to completed
    if (order.paymentStatus === "cod") {
      await Order.findByIdAndUpdate(
        id,
        {
          paymentStatus: "completed",
        },
        { new: true }
      );
    }
  }

  const order = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: status,
    },
    { new: true }
  );

  if (!order) {
    return next(new ApiError(404, "Order not found"));
  }

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});

const validateOrder = (order) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    products: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().default(1),
        name: Joi.string(),
      })
    ),
    paymentStatus: Joi.string().valid("pending", "completed", "failed", "cod"),
    paymentId: Joi.string(),
    shippingAddress: Joi.string().required(),
    totalAmount: Joi.number(),
    stockReserved: Joi.boolean(),
  });

  return schema.validate(order);
};
