import Product from "../models/Product.js";
import ExpensiveProduct from "../models/ExpensiveProduct.js";

// =========================== Rate a Product ==========================

export const rateProduct = async (req, res) => {
  try {
    const { productId, rating, productType } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    let product;
    if (productType === "expensive") {
      product = await ExpensiveProduct.findById(productId);
    } else {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already rated this product
    const existingRatingIndex = product.ratings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      product.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      product.ratings.push({ userId, rating });
    }

    // Calculate average rating
    const total = product.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    product.averageRating = Math.round((total / product.ratings.length) * 10) / 10;

    await product.save();

    res.json({
      message: "Rating submitted successfully",
      averageRating: product.averageRating,
      totalRatings: product.ratings.length,
    });
  } catch (err) {
    console.error("Rate product error:", err);
    res.status(500).json({ message: "Failed to rate product" });
  }
};

// =========================== Get Product Rating ==========================

export const getProductRating = async (req, res) => {
  try {
    const { productId, productType } = req.params;

    let product;
    if (productType === "expensive") {
      product = await ExpensiveProduct.findById(productId);
    } else {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if current user has rated
    const userId = req.user?.id;
    let userRating = null;
    if (userId) {
      const userRatingObj = product.ratings.find(
        (r) => r.userId.toString() === userId
      );
      userRating = userRatingObj ? userRatingObj.rating : null;
    }

    res.json({
      averageRating: product.averageRating,
      totalRatings: product.ratings.length,
      userRating,
    });
  } catch (err) {
    console.error("Get product rating error:", err);
    res.status(500).json({ message: "Failed to get product rating" });
  }
};
