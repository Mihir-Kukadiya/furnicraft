import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: false,
        },
        name: {
          type: String,
          required: true,
          match: [/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"],
        },
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: {
        values: ["cod", "card", "upi"],
        message: "Payment method must be 'cod', 'card', or 'upi'",
      },
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Approved", "Rejected"],
        message: "Status must be in 'Pending', 'Approved' or 'Rejected'",
      },
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
