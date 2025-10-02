import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    match: [/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"],
  },
  price: {
    type: Number,
    required: true,
    min: [1, "Price must be greater than 0"],
  },
  img: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: {
      values: ["Chairs", "Sofas", "Tables"],
      message: "Category must be either 'Chairs', 'Sofas' or 'Tables'",
    },
  },
  description: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
