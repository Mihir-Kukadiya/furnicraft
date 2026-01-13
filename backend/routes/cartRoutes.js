import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";

import { protect, userOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/:email", protect, userOnly, getCart);
router.post("/add", protect, userOnly, addToCart);
router.put("/quantity", protect, userOnly, updateQuantity);
router.delete("/remove", protect, userOnly, removeItem);
router.delete("/clear/:email", protect, userOnly, clearCart);

export default router;
