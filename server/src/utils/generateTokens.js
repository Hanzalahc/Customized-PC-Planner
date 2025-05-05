import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || "1d",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d",
  });

  const passToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_PASS_EXPIRY || "5m",
  });

  return { accessToken, refreshToken, passToken };
};

export { generateToken };
