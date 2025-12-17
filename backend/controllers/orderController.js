import Order from "../models/Order.js";

// =========================== Get all Orders ==========================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ============================ Add an Order ==========================

const createOrder = async (req, res) => {
  try {
    console.log("📩 Incoming order data:", JSON.stringify(req.body, null, 2));

    const order = new Order(req.body);
    const saved = await order.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Order save error:", err);
    res.status(500).json({
      error: "Failed to save order",
      name: err.name,
      message: err.message,
      stack: err.stack,
      errors: err.errors || null,
    });
  }
};

// ============================== Update Order Status ==========================

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid status value" });
    }

    res.status(500).json({ message: "Failed to update order status", error });
  }
};

// ============================ Delete an Order by ID ==========================

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🗑️ Delete request for ID:", id);

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      console.log("⚠️ No order found with this ID");
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

// ============================= Clear all Orders ==========================
 
const clearAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "All orders deleted successfully" });
  } catch (err) {
    console.error("❌ Clear all orders error:", err);
    res.status(500).json({ error: "Failed to clear all orders" });
  }
};

export { getOrders, createOrder, updateOrderStatus, deleteOrder, clearAllOrders };