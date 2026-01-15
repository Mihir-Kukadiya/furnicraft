import express from "express";
import {
  login,
  registerUser,
  changePassword,
  updateAdminProfile,
  createAdmin,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", registerUser);
router.post("/change-password", protect, changePassword);

router.put("/admin/update", protect, adminOnly, updateAdminProfile);
router.post("/create-admin", protect, adminOnly, createAdmin);

export default router;
