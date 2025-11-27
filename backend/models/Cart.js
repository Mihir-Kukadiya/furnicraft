import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 },
    }
  ],
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
