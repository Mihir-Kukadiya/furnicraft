import express from "express";
import { rateProduct, getProductRating } from "../controllers/ratingController.js";
import { protect } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Rate a product (requires login)
router.post("/", protect, rateProduct);

// Get product rating (requires login to return user's rating)
router.get("/:productId/:productType", protect, getProductRating);

export default router;
