import ExpensiveProduct from "../models/ExpensiveProduct.js";

// ================= GET =================
export const getExpensiveProducts = async (req, res) => {
  try {
    const products = await ExpensiveProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE =================
export const createExpensiveProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    // ✅ Cloudinary file check
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new ExpensiveProduct({
      name,
      price,
      category,
      description,
      img: req.file.path,   // ✅ Cloudinary URL
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (err) {
    console.error("Expensive product save error:", err);
    res.status(400).json({ message: err.message });
  }
};

// ================= UPDATE =================
export const updateExpensiveProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ If new image uploaded
    if (req.file) {
      updateData.img = req.file.path;
    }

    const updated = await ExpensiveProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DELETE =================
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
