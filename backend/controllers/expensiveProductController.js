import ExpensiveProduct from "../models/ExpensiveProduct.js";

// GET all expensive products
export const getExpensiveProducts = async (req, res) => {
  try {
    const products = await ExpensiveProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new expensive product
export const createExpensiveProduct = async (req, res) => {
  try {
    const product = new ExpensiveProduct(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ UPDATE expensive product
export const updateExpensiveProduct = async (req, res) => {
  try {
    const updatedProduct = await ExpensiveProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Expensive product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE expensive product
export const deleteExpensiveProduct = async (req, res) => {
  try {
    const deleted = await ExpensiveProduct.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Expensive product not found" });
    }

    res.json({ message: "Expensive product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
