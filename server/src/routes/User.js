import express from "express";
import {
  UserRegister,
  verifyEmail,
  UserLogin,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserAvatar,
  updateUserDetails,
  forgetUserPassword,
  verifyUserPasswordResetToken,
  changeCurrentPassword,
  loginAndRegisterWithGoogle,
  getAllUsers,
  filters,
  EditUserStatusByAdmin,
} from "../controllers/User.js";
import {
  isAuthenticated,
  isPassTokenAuthenticated,
} from "../middlewares/isAuth.js";
import { multerFileUpload } from "../middlewares/multerFile.js";
const router = express.Router();

router.post("/register", UserRegister);
router.get("/verify-email/:token", verifyEmail);
router.patch("/login", UserLogin);
router.get("/logout", isAuthenticated, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/current-user", isAuthenticated, getCurrentUser);
router.patch(
  "/update-avatar",
  multerFileUpload.single("avatar"),
  isAuthenticated,
  updateUserAvatar
);
router.patch("/update-details", isAuthenticated, updateUserDetails);
router.patch("/forget-password", forgetUserPassword);
router.get(
  "/verify-password-reset-token/:token",
  isPassTokenAuthenticated,
  verifyUserPasswordResetToken
);
router.patch(
  "/change-password",
  isPassTokenAuthenticated,
  changeCurrentPassword
);
router.post("/google-login", loginAndRegisterWithGoogle);

// admin routes
router.get("/all", isAuthenticated, getAllUsers);
router.get("/filters", isAuthenticated, filters);
router.patch("/edit-status", isAuthenticated, EditUserStatusByAdmin);

export default router;
