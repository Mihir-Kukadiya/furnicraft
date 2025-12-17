import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
    }
  ]
}, { timestamps: true });

export default mongoose.model("Favorite", favoriteSchema);
