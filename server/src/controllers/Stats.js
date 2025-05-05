import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/PreBuildCategory.js";
import Order from "../models/Order.js";

export const getStats = asyncHandler(async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({ role: { $ne: "admin" } });
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    const pendingOrderCount = await Order.countDocuments({
      orderStatus: "pending",
    });

    const totalSalesAmountResult = await Order.aggregate([
      {
        $match: { paymentStatus: "completed", orderStatus: "delivered" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalSalesCountResult = await Order.aggregate([
      {
        $match: { paymentStatus: "completed", orderStatus: "delivered" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
        },
      },
    ]);

    // Extract values safely or default to 0
    const totalSalesAmount =
      totalSalesAmountResult.length > 0 ? totalSalesAmountResult[0].total : 0;
    const totalSalesCount =
      totalSalesCountResult.length > 0 ? totalSalesCountResult[0].total : 0;

    const monthlySales = await Order.aggregate([
      {
        $match: { paymentStatus: "completed", orderStatus: "delivered" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const chartData = months.map((month, index) => {
      const sales = monthlySales.find((s) => s._id === index + 1);
      const users = monthlyUsers.find((u) => u._id === index + 1);

      return {
        name: month,
        totalSales: sales ? sales.totalSales : 0,
        totalUsers: users ? users.totalUsers : 0,
      };
    });

    res.status(200).json({
      success: true,
      message: "Stats fetched successfully",
      data: {
        userCount,
        productCount,
        categoryCount,
        pendingOrderCount,
        totalSalesAmount,
        totalSalesCount,
        chartData,
      },
    });
  } catch (error) {
    next(new ApiError(500, "Error fetching stats"));
  }
});

export const bottleneckScoreCalculation = asyncHandler(
  async (req, res, next) => {
    const { cpuScore, gpuScore, resolution, purpose } = req.body;

    if (!cpuScore || !gpuScore || !resolution || !purpose) {
      return next(new ApiError(400, "Please provide all required fields"));
    }

    // Define weight matrix for realistic scoring
    const weightMatrix = {
      gaming: {
        "1080p": { cpuWeight: 0.4, gpuWeight: 0.6 },
        "1440p": { cpuWeight: 0.3, gpuWeight: 0.7 },
        "4K": { cpuWeight: 0.2, gpuWeight: 0.8 },
      },
      editing: {
        "1080p": { cpuWeight: 0.6, gpuWeight: 0.4 },
        "1440p": { cpuWeight: 0.5, gpuWeight: 0.5 },
        "4K": { cpuWeight: 0.4, gpuWeight: 0.6 },
      },
      ai: {
        "1080p": { cpuWeight: 0.3, gpuWeight: 0.7 },
        "1440p": { cpuWeight: 0.2, gpuWeight: 0.8 },
        "4K": { cpuWeight: 0.1, gpuWeight: 0.9 },
      },
      general: {
        "1080p": { cpuWeight: 0.7, gpuWeight: 0.3 },
        "1440p": { cpuWeight: 0.6, gpuWeight: 0.4 },
        "4K": { cpuWeight: 0.5, gpuWeight: 0.5 },
      },
    };

    const weights = weightMatrix[purpose]?.[resolution];

    if (!weights) {
      return next(new ApiError(400, "Invalid resolution or purpose provided"));
    }

    const { cpuWeight, gpuWeight } = weights;

    const weightedCPU = cpuScore * cpuWeight;
    const weightedGPU = gpuScore * gpuWeight;

    const slower = Math.min(weightedCPU, weightedGPU);
    const faster = Math.max(weightedCPU, weightedGPU);

    const bottleneckPercentage = ((1 - slower / faster) * 100).toFixed(2) + "%";

    res.status(200).json({
      success: true,
      message: "Bottleneck score calculated successfully",
      data: {
        bottleneckPercentage,
        slowerComponent: weightedCPU < weightedGPU ? "CPU" : "GPU",
      },
    });
  }
);
