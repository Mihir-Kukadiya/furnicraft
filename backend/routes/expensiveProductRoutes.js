import express from "express";
import {
  getExpensiveProducts,
  createExpensiveProduct,
  deleteExpensiveProduct,
  updateExpensiveProduct,
} from "../controllers/expensiveProductController.js";

import upload from "../middlewares/upload.js";        // ✅ ADD THIS
import { protect, adminOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", getExpensiveProducts);

// ✅ CLOUDINARY FILE UPLOAD
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("img"),
  createExpensiveProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("img"),
  updateExpensiveProduct
);

router.delete("/:id", protect, adminOnly, deleteExpensiveProduct);

export default router;
