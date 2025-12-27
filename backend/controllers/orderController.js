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

    const { items, total } = req.body;

    // ================== BACKEND TOTAL CALCULATION ==================

    // 1️⃣ Subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 2️⃣ Discount (10%)
    const discount = subtotal * 0.10;
    const taxableAmount = subtotal - discount;

    // 3️⃣ GST
    const cgst = taxableAmount * 0.09;
    const sgst = taxableAmount * 0.09;
    const igst = 0;

    // 4️⃣ Shipping
    const shipping = subtotal > 2000 ? 0 : 100;

    // 5️⃣ Final Total (GST INCLUDED)
    const expectedTotal =
      taxableAmount + cgst + sgst + igst + shipping;

    // 6️⃣ FLOAT SAFE COMPARISON
    if (Math.abs(total - expectedTotal) > 0.01) {
      return res.status(400).json({
        message: `Invalid total amount. Expected ${expectedTotal.toFixed(
          2
        )}, but received ${total}`,
      });
    }

    // ================== SAVE ORDER ==================

    const order = new Order({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      items: req.body.items,

      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      cgst: Number(cgst.toFixed(2)),
      sgst: Number(sgst.toFixed(2)),
      igst: Number(igst.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(expectedTotal.toFixed(2)),

      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || "Pending",
      orderDate: new Date(),
      receiveDate: null,
    });

    const saved = await order.save();

    console.log("✅ Order saved:", {
      id: saved._id,
      total: saved.total,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Order save error:", err);
    res.status(500).json({
      error: "Failed to save order",
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