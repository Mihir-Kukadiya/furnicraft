import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:email", getCart);
router.post("/add", addToCart);
router.put("/quantity", updateQuantity);
router.delete("/remove", removeItem);
router.delete("/clear/:email", clearCart);

export default router;
