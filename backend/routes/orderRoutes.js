import express from "express";
import { deleteOrder } from "../controllers/orderController.js";
import { updateOrderStatus } from "../controllers/orderController.js";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming order data:", JSON.stringify(req.body, null, 2));

    const order = new Order(req.body);
    const saved = await order.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Order save error:", err);
    res.status(500).json({
      error: "Failed to save order",
      name: err.name,
      message: err.message,
      stack: err.stack,
      errors: err.errors || null,
    });
  }
});

router.put("/:id/status", updateOrderStatus);

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.delete("/clear-all", async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "All orders deleted successfully" });
  } catch (err) {
    console.error("❌ Clear all orders error:", err);
    res.status(500).json({ error: "Failed to clear all orders" });
  }
});

router.delete("/:id", deleteOrder);

export default router;
