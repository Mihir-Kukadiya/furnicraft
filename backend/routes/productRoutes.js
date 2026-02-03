import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/upload.js";
import { protect, adminOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, adminOnly, upload.single("img"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("img"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
