import express from "express";
import { rateProduct, getProductRating, submitOrderItemRating } from "../controllers/ratingController.js";
import { protect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Rate a product (requires login)
router.post("/", protect, rateProduct);

// Get product rating (requires login to return user's rating)
router.get("/:productId/:productType", protect, getProductRating);

// Submit order item rating (requires login)
router.post("/order-item", protect, submitOrderItemRating);

export default router;
