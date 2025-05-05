import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized Request!", success: false });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded?.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid Access Token", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid Access Token",
        success: false,
        error: true,
      });
    }
    next(error);
  }
};

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `${req.userRole} not allowed to access this resource.`,
        success: false,
      });
    }
    next();
  };
};

export const isPassTokenAuthenticated = async (req, res, next) => {
  try {
    const passToken =
      req.cookies?.passToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!passToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized request", success: false });
    }

    const decoded = jwt.verify(passToken, process.env.JWT_SECRET);

    const user = await User.findById(decoded?.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid Access Token", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid Pass Token",
        success: false,
        error: true,
      });
    }
    next(error);
  }
};
