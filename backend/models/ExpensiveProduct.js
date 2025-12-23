import mongoose from "mongoose";

const expensiveProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["Chairs", "Sofas", "Tables"],
        message: "Category must be either 'Chairs', 'Sofas' or 'Tables'",
      },
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExpensiveProduct", expensiveProductSchema);
