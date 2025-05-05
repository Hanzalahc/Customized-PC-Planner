import Address from "../models/Address.js";
import User from "../models/User.js";
import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addAddress = asyncHandler(async (req, res, next) => {
  const { error } = validateAddress(req.body);
  if (error) {
    return next(new ApiError(400, error.details[0].message));
  }

  const userData = req.user;

  const userAddress = await Address.find({ userId: userData?._id });
  const addressCount = userAddress.length;

  if (addressCount >= 3) {
    return next(new ApiError(400, "You can add only 3 addresses"));
  }

  const { mobile, addressLine, city, state, pinCode, country, addressType } =
    req.body;

  const findedAddress = await Address.findOne({
    userId: userData?._id,
    addressLine,
    addressType,
    mobile,
    city,
    state,
    pinCode,
    country,
  });

  if (findedAddress) {
    return next(new ApiError(400, "Address already exists with these details"));
  }

  const address = new Address({
    userId: userData?._id,
    mobile,
    addressType,
    addressLine,
    city,
    state,
    pinCode,
    country,
  });

  await address.save();

  if (!address) {
    return next(new ApiError(500, "Something went wrong while adding address"));
  }

  // push addrress id in user modal
  const updatedUser = await User.findByIdAndUpdate(userData?._id, {
    $push: { addressDetails: address?._id },
  });

  if (!updatedUser) {
    address.remove();
    return next(new ApiError(500, "Something went wrong while adding address"));
  }

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    data: address,
  });
});

export const getUserAllAddress = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  const userAddress = await Address.find({ userId: userData?._id });
  const addressCount = userAddress.length;

  if (!userAddress || userAddress.length === 0) {
    return next(new ApiError(404, `No address found for ${userData?.name}`));
  }

  res.status(200).json({
    success: true,
    message: `Found ${addressCount} addresses for ${userData?.name}`,
    count: addressCount,
    data: userAddress,
  });
});

export const deleteAddress = asyncHandler(async (req, res, next) => {
  const userData = req.user;
  const addressId = req.body.id;

  const address = await Address.findOneAndDelete({
    _id: addressId,
    userId: userData?._id,
  });

  if (!address) {
    return next(new ApiError(404, "Address not found"));
  }

  const updatedUser = await User.findByIdAndUpdate(userData?._id, {
    $pull: { addressDetails: addressId },
  });

  if (!updatedUser) {
    return next(
      new ApiError(500, "Something went wrong while deleting address")
    );
  }

  res.status(200).json({
    success: true,
    message: "Address deleted successfully",
  });
});

const validateAddress = (data) => {
  const schema = Joi.object({
    mobile: Joi.string()
      .pattern(/^\+?[0-9]+(\s[0-9]+)*$/)
      .required()
      .messages({
        "string.pattern.base":
          "Mobile must contain only numbers and spaces in the correct format",
      }),
    addressType: Joi.string().valid("home", "work").required().messages({
      "string.empty": "Address type is required",
      "any.only": "Address type must be either 'home' or 'work'",
    }),
    addressLine: Joi.string().min(5).max(100).required().messages({
      "string.empty": "Address line is required",
      "string.min": "Address line must be at least 5 characters",
      "string.max": "Address line must not exceed 100 characters",
    }),
    city: Joi.string().min(2).max(50).required().messages({
      "string.empty": "City is required",
      "string.min": "City must be at least 2 characters",
      "string.max": "City must not exceed 50 characters",
    }),
    state: Joi.string().min(2).max(50).required().messages({
      "string.empty": "State is required",
      "string.min": "State must be at least 2 characters",
      "string.max": "State must not exceed 50 characters",
    }),
    pinCode: Joi.string()
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        "string.empty": "Pin code is required",
        "string.pattern.base": "Pin code must be a 6-digit number",
      }),
    country: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Country is required",
      "string.min": "Country must be at least 2 characters",
      "string.max": "Country must not exceed 50 characters",
    }),
  });

  return schema.validate(data);
};
