import Order from "../models/Order.js";

// =========================== Get all Orders ==========================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .select('+orderDate +receiveDate')
      .sort({ createdAt: -1 });
    
    console.log("📋 Fetched orders count:", orders.length);
    if (orders.length > 0) {
      console.log("Sample order dates:", {
        orderDate: orders[0].orderDate,
        receiveDate: orders[0].receiveDate,
        createdAt: orders[0].createdAt
      });
    }
    
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

    const order = new Order({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      items: req.body.items,
      total: req.body.total,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "Pending",
      orderDate: new Date(),
      receiveDate: null,
    });

    const saved = await order.save();
    
    console.log("✅ Order saved:", {
      id: saved._id,
      orderDate: saved.orderDate,
      receiveDate: saved.receiveDate,
      status: saved.status
    });
    
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Order save error:", err);
    res.status(500).json({
      error: "Failed to save order",
      name: err.name,
      message: err.message,
    });
  }
};

// ============================== Update Order Status ==========================

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log("📝 Updating order:", id, "to status:", status);

    const existingOrder = await Order.findById(id);
    
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updateData = { status };

    if (status === "Completed" && !existingOrder.receiveDate) {
      updateData.receiveDate = new Date();
      console.log("✅ Setting receiveDate:", updateData.receiveDate);
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log("📦 Updated order:", {
      id: updatedOrder._id,
      status: updatedOrder.status,
      orderDate: updatedOrder.orderDate,
      receiveDate: updatedOrder.receiveDate
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Update order status error:", error);

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

export {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};