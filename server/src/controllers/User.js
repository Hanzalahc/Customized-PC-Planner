import bcrypt from "bcrypt";
import User from "../models/User.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/generateTokens.js";
import { sendVerifyMail, sendResetPasswordMail } from "../utils/sendMail.js";

import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";

export const UserRegister = asyncHandler(async (req, res, next) => {
  const { error: validateError } = validateUser(req.body);

  if (validateError) {
    return next(new ApiError(401, validateError.details[0].message));
  }

  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return next(new ApiError(400, "User already exists"));
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationUrl = `${process.env.CORS_ORIGIN}/verify-email-link/${verificationToken}`;
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    emailVerificationToken: verificationToken,
  });

  if (!newUser) {
    return next(new ApiError(500, "Something went wrong while registering"));
  }

  await sendVerifyMail(verificationUrl, email);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      ...newUser._doc,
      password: undefined,
      emailVerificationToken: undefined,
    },
  });
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new ApiError(400, "Token is required"));
  }

  const user = await User.findOne({
    emailVerificationToken: token,
  });

  if (!user) {
    return next(new ApiError(404, "Unauthorized access"));
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        emailVerificationToken: 1,
      },
      $set: {
        emailVerified: true,
      },
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

export const UserLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Credentials are required"));
  }

  // need to populate the user to store them in redux and use later
  const user = await User.findOne({ email }).populate([
    {
      path: "addressDetails",
      select: "-userId",
    },
    {
      path: "orderHistory",
      populate: [
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
      ],
    },
  ]);

  if (!user) {
    return next(new ApiError(404, "User not found with these credentials"));
  }

  if (!user.emailVerified) {
    return next(
      new ApiError(403, "Email is not verified, please verify email")
    );
  }

  if (user.status !== "active") {
    return next(new ApiError(403, "User is not active, please contact admin"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid && user?.googleId) {
    return next(
      new ApiError(400, "Invalid credentials. Please check your login method.")
    );
  }

  if (!isPasswordValid) {
    return next(new ApiError(403, "Invalid credentials"));
  }

  const payload = {
    userId: user?._id,
  };

  const { accessToken, refreshToken } = generateToken(payload);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_SS || "lax",
  };

  user.refreshToken = refreshToken;
  user.lastLoginDate = Date.now();

  const loggedInUser = await user.save();

  if (!loggedInUser) {
    return next(new ApiError(500, "Something went wrong while logging in"));
  }

  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  return res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      ...loggedInUser._doc,
      password: undefined,
      emailVerificationToken: undefined,
    },
  });
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_SS || "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ success: true, message: "Logged out successfully" });
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.body?.refreshToken || req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    return next(new ApiError(401, "unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedToken?.userId);

    if (!user) {
      return next(new ApiError(401, "Invalid refresh token, please login"));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return next(
        new ApiError(401, "Your refresh token has been expired, please login")
      );
    }

    const payload = {
      userId: user?._id,
    };

    const { accessToken } = generateToken(payload);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_SS || "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ success: true, message: "Access token refreshed" });
  } catch (error) {
    return next(new ApiError(401, error?.message || "Invalid refresh token"));
  }
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "User details fetched successfully",
    data: {
      ...req.user?._doc,
      password: undefined,
      emailVerificationToken: undefined,
    },
  });
});

export const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarPath = req.file?.path;

  if (!req.file || !avatarPath) {
    return next(new ApiError(400, "No file uploaded"));
  }

  // remove previous avatar from Cloudinary if exists
  if (req.user?.avatar?.publicId) {
    const cloudinaryDeleteResult = await deleteImageFromCloudinary(
      req.user.avatar.publicId
    );

    if (req.user?.avatar?.publicId && !cloudinaryDeleteResult) {
      return next(
        new ApiError(500, "Failed to delete previous avatar from Cloudinary")
      );
    }
  }

  const cloudinaryResult = await uploadOnCloudinary(avatarPath);

  if (!cloudinaryResult) {
    return next(new ApiError(500, "Failed to upload image to Cloudinary"));
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      avatar: {
        url: cloudinaryResult?.secure_url,
        publicId: cloudinaryResult?.public_id,
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(
      new ApiError(500, "Something went wrong while updating avatar")
    );
  }

  return res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    data: {
      ...user._doc,
      password: undefined,
    },
  });
});

export const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { error } = validateUserUpdateDetails(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const { name, email, mobile } = req.body;

  if (
    name === req.user?.name &&
    email === req.user?.email &&
    mobile === req.user?.mobile
  ) {
    return next(new ApiError(400, "No changes found"));
  }

  let updatedUser;

  // check if email is changed and then handle accordingly
  if (email !== req.user?.email) {
    const user = await User.findOne({ email });
    if (user) {
      return next(new ApiError(400, "User already exists with this email"));
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationUrl = `${process.env.CORS_ORIGIN}/verify-email/${verificationToken}`;

    updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        name,
        email,
        mobile,
        emailVerificationToken: verificationToken,
        emailVerified: false,
      },
      {
        new: true,
      }
    );

    await sendVerifyMail(verificationUrl, email);
  } else {
    updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        name,
        mobile,
      },
      {
        new: true,
      }
    );
  }

  if (!updatedUser) {
    return next(
      new ApiError(500, "Something went wrong while updating user details")
    );
  }

  return res.status(200).json({
    success: true,
    message: "User details updated successfully",
    data: {
      ...updatedUser._doc,
      password: undefined,
    },
  });
});

export const forgetUserPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(400, "Email is required"));
  }

  const formattedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ formattedEmail });

  if (!user || !user.role === "user") {
    return next(new ApiError(404, "User not found wit these credentials"));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetUrl = `${process.env.CORS_ORIGIN}/verify-password-link/${resetToken}`;

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour

  await user.save({ validateBeforeSave: false });

  await sendResetPasswordMail(resetUrl, formattedEmail);

  const payload = {
    userId: user._id,
  };

  const { passToken } = generateToken(payload);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_SS || "lax",
  };

  res.cookie("passToken", passToken, options);

  return res.status(200).json({
    success: true,
    message: "Password reset link sent to email, You have 1 hour to reset",
  });
});

export const verifyUserPasswordResetToken = asyncHandler(
  async (req, res, next) => {
    const { token } = req.params;
    const user = req.user;

    if (!token) {
      return next(new ApiError(400, "Token is required"));
    }

    const findeduser = await User.findById(user?._id);

    if (!findeduser) {
      return next(new ApiError(404, "User not found"));
    }

    if (findeduser.passwordResetToken !== token) {
      return next(new ApiError(400, "Token is invalid"));
    }

    if (findeduser.passwordResetExpires < Date.now()) {
      return next(new ApiError(400, "Token is expired"));
    }

    return res.status(200).json({
      success: true,
      message:
        "Password reset token is valid, You have 1 hour to reset your password",
    });
  }
);

export const changeCurrentPassword = asyncHandler(async (req, res, next) => {
  const { newPassword, email } = req.body;
  const user = req?.user;

  if (!newPassword) {
    return next(new ApiError(400, "New password is required"));
  }

  const findedUser = await User.findById(user?._id || email);

  if (!findedUser) {
    return next(new ApiError(404, "User not found"));
  }

  const areBothPasswordSame = await bcrypt.compare(
    newPassword,
    findedUser.password
  );

  if (areBothPasswordSame) {
    return next(new ApiError(400, "New password can't be the same as old"));
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  const updateUserPassword = await User.findByIdAndUpdate(
    findedUser?._id,
    {
      $unset: {
        passwordResetToken: 1,
        passwordResetExpires: 1,
      },
      $set: {
        password: hashPassword,
      },
    },
    {
      new: true,
    }
  );

  if (!updateUserPassword) {
    return next(new ApiError(404, "unauthorized request!"));
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_SS || "lax",
  };

  return res
    .clearCookie("passToken", options)
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
});

export const loginAndRegisterWithGoogle = asyncHandler(
  async (req, res, next) => {
    const { name, email, avatar, googleId } = req.body;

    const findedUser = await User.findOne({ email }).populate([
      {
        path: "addressDetails",
        select: "-userId",
      },
      {
        path: "orderHistory",
        populate: [
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
        ],
      },
    ]);

    if (findedUser) {
      if (findedUser.status !== "active") {
        return next(
          new ApiError(403, "User is not active, please contact admin")
        );
      }

      if (findedUser.emailVerified === false) {
        await User.findByIdAndUpdate(
          findedUser._id,
          {
            $set: {
              emailVerified: true,
            },
            $unset: {
              emailVerificationToken: 1,
            },
          },
          {
            new: true,
          }
        );
      }

      if (
        findedUser.avatar.publicId &&
        avatar.publicId !== findedUser.avatar.publicId
      ) {
        const cloudinaryDeleteResult = await deleteImageFromCloudinary(
          findedUser.avatar.publicId
        );

        if (findedUser.avatar.publicId && !cloudinaryDeleteResult) {
          return next(
            new ApiError(
              500,
              "Failed to delete previous avatar from Cloudinary"
            )
          );
        }

        findedUser.avatar = avatar;
      }

      if (!findedUser.googleId) {
        findedUser.googleId = googleId;
      }

      const payload = {
        userId: findedUser._id,
      };

      const { accessToken, refreshToken } = generateToken(payload);

      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_SS || "lax",
      };

      findedUser.refreshToken = refreshToken;
      findedUser.avatar = avatar;
      findedUser.lastLoginDate = Date.now();

      if (!findedUser.googleId) {
        findedUser.googleId = googleId;
      }

      const loggedInUser = await findedUser.save();

      if (!loggedInUser) {
        return next(new ApiError(500, "Something went wrong while logging in"));
      }

      res.cookie("accessToken", accessToken, options);
      res.cookie("refreshToken", refreshToken, options);

      return res.status(200).json({
        success: true,
        message: "Singed in with google successfully",
        data: {
          ...loggedInUser._doc,
          password: undefined,
          googleId: undefined,
        },
      });
    }

    // if user not found then register user

    const newUser = await User.create({
      name,
      email,
      avatar,
      googleId,
      emailVerified: true,
    });

    if (!newUser) {
      return next(new ApiError(500, "Something went wrong while registering"));
    }

    const payload = {
      userId: newUser._id,
    };

    const { accessToken, refreshToken } = generateToken(payload);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_SS || "lax",
    };

    newUser.refreshToken = refreshToken;

    newUser.lastLoginDate = Date.now();

    const loggedInUser = await newUser.save();

    if (!loggedInUser) {
      return next(new ApiError(500, "Something went wrong while logging in"));
    }

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    return res.status(201).json({
      success: true,
      message: "Singed up with google successfully",
      data: {
        ...loggedInUser._doc,
        password: undefined,
        googleId: undefined,
      },
    });
  }
);

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  const totalUsers = await User.countDocuments({ role: "user" });
  const users = await User.find({ role: "user" })
    .select(
      "-password -refreshToken -emailVerificationToken -passwordResetToken -passwordResetExpires -addressDetails -shoppingCart -wishlist "
    )
    .populate({
      path: "reviews",
      select: "_id",
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const totalPages = Math.ceil(totalUsers / pageSize);

  if (users.length === 0) {
    return next(new ApiError(404, "No users found"));
  }

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    totalPages: totalPages,
    data: users,
  });
});

export const filters = asyncHandler(async (req, res, next) => {
  const { status, emailVerified } = req.query;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  const filters = {
    role: "user",
  };

  if (status) {
    filters.status = status;
  }

  if (emailVerified) {
    if (emailVerified === "true") {
      filters.emailVerified = true;
    } else {
      filters.emailVerified = false;
    }
  }

  const totalUsers = await User.countDocuments(filters);
  const users = await User.find(filters)
    .select(
      "-password -refreshToken -emailVerificationToken -passwordResetToken -passwordResetExpires -addressDetails -shoppingCart -wishlist"
    )
    .populate({
      path: "reviews",
      select: "_id",
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const totalPages = Math.ceil(totalUsers / pageSize);

  if (users.length === 0) {
    return next(new ApiError(404, "No users found"));
  }

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    totalPages: totalPages,
    data: users,
  });
});

export const EditUserStatusByAdmin = asyncHandler(async (req, res, next) => {
  const { id, status } = req.body;

  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new ApiError(403, "Unauthorized request"));
  }

  if (!id || !status) {
    return next(new ApiError(400, "Id and status are required"));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  if (user.status === status) {
    return next(new ApiError(400, "No changes detected"));
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      status,
    },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    return next(new ApiError(500, "Failed to update user status"));
  }

  return res.status(200).json({
    success: true,
    message: "User status updated successfully",
  });
});

// joi validation function

function validateUser(data) {
  const userSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*./[\\]{}()_+-=]).{8,}$"
        )
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one digit, and one special character.",
      }),
  });

  return userSchema.validate(data);
}

const validateUserUpdateDetails = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email",
    }),
    mobile: Joi.string()
      .pattern(/^\+?[0-9]+(\s[0-9]+)*$/)
      .allow(null)
      .messages({
        "string.pattern.base":
          "Mobile must contain only numbers and spaces in the correct format",
      }),
  });

  return schema.validate(data);
};
