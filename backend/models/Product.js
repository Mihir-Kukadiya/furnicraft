import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
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
