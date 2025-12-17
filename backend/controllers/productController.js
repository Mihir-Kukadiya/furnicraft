import Product from "../models/Product.js";

// =========================== Get all products ==========================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Fetch products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ============================ Add a new product ==========================

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("❌ Save product error:", err);
    res.status(500).json({ error: "Failed to save product", details: err.message });
  }
};

// ============================= Update a product ==========================

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("❌ Update product error:", err);
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// ============================= Delete a product ==========================

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Delete product error:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
};