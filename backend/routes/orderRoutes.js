import express from "express";
import {
  createOrder,
  getOrders,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect, adminOnly, userOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", protect, getOrders);
router.post("/", protect, userOnly, createOrder);
router.delete("/:id", protect, deleteOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
