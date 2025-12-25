import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },

    customerEmail: {
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
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String },
      },
    ],

    total: { type: Number, required: true, default: 0 },

    address: { type: String, required: true },

    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    orderDate: { type: Date, default: Date.now },
    receiveDate: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.pre("validate", function (next) {
  const calculatedTotal = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (Math.abs(this.total - calculatedTotal) > 0.01) {
    return next(
      new Error(
        `Invalid total amount. Expected ${calculatedTotal}, but received ${this.total}`
      )
    );
  }

  next();
});


const Order = mongoose.model("Order", orderSchema);
export default Order;
