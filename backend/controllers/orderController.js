// DELETE /api/orders/:id
import Order from "../models/Order.js"; // your order model

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true} // ✅ runValidators is crucial
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

export const deleteOrder = async (req, res) => {
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
