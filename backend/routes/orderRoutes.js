import express from "express";
import {
  createOrder,
  getOrders,
  deleteOrder,
  clearAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.delete("/clear-all", clearAllOrders);
router.delete("/:id", deleteOrder);
router.put("/:id/status", updateOrderStatus);

export default router;
