import express from "express";
import {
  getExpensiveProducts,
  createExpensiveProduct,
  deleteExpensiveProduct,
  updateExpensiveProduct,
} from "../controllers/expensiveProductController.js";

import { protect, adminOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getExpensiveProducts);
router.post("/", protect, adminOnly, createExpensiveProduct);
router.put("/:id", protect, adminOnly, updateExpensiveProduct);
router.delete("/:id", protect, adminOnly, deleteExpensiveProduct);

export default router;
