import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Calculate average rating before saving
productSchema.pre("save", function (next) {
  if (this.ratings && this.ratings.length > 0) {
    const total = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
    this.averageRating = Math.round((total / this.ratings.length) * 10) / 10;
  } else {
    this.averageRating = 0;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
