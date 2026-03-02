import Order from "../models/Order.js";
import Auth from "../models/AuthModel.js";

// =========================== Get all Orders ==========================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .select("+orderDate +receiveDate")
      .sort({ createdAt: -1 });

    console.log("📋 Fetched orders count:", orders.length);
    if (orders.length > 0) {
      console.log("Sample order dates:", {
        orderDate: orders[0].orderDate,
        receiveDate: orders[0].receiveDate,
        createdAt: orders[0].createdAt,
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

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const discount = subtotal * 0.1;
    const taxableAmount = subtotal - discount;

    const cgst = taxableAmount * 0.09;
    const sgst = taxableAmount * 0.09;
    const igst = 0;

    const shipping = subtotal > 2000 ? 0 : 100;

    const expectedTotal = taxableAmount + cgst + sgst + igst + shipping;

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

    // ✅ check login user role
    const userRole = req.user?.role;

    // ✅ ROLE BASED VALIDATION
    if (userRole === "admin") {
      // admin allowed only completed
      if (status !== "Completed") {
        return res.status(403).json({
          message: "Admin can only change status to Completed",
        });
      }
    } else if (userRole === "user") {
      // user allowed only cancelled
      if (status !== "Cancelled") {
        return res.status(403).json({
          message: "User can only change status to Cancelled",
        });
      }
    } else {
      return res.status(403).json({ message: "Role not allowed" });
    }

    const existingOrder = await Order.findById(id);

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ extra security: user can cancel ONLY their own order
    if (userRole === "user" && existingOrder.customerEmail !== req.user.email) {
      return res.status(403).json({
        message: "You can cancel only your own orders",
      });
    }

    // ✅ if already completed, user cannot cancel later
    if (existingOrder.status === "Completed") {
      return res.status(400).json({
        message: "Order already Completed, cannot change status",
      });
    }

    const updateData = { status };

    // ✅ set receiveDate only when completed
    if (status === "Completed" && !existingOrder.receiveDate) {
      updateData.receiveDate = new Date();
      console.log("✅ Setting receiveDate:", updateData.receiveDate);
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Create notification for user when order is completed
    if (status === "Completed") {
      try {
        const user = await Auth.findOne({ email: existingOrder.customerEmail });
        
        if (user) {
          const newNotification = {
            orderId: existingOrder._id,
            message: `Your order has been completed! Order ID: ${existingOrder._id.toString().slice(-6)}`,
            type: "order_completed",
            isRead: false,
            createdAt: new Date(),
          };

          user.notifications = user.notifications || [];
          user.notifications.unshift(newNotification);
          await user.save();
          
          console.log("✅ Notification created for user:", user.email);
        }
      } catch (notifErr) {
        console.error("❌ Failed to create notification:", notifErr);
      }
    }

    console.log("📦 Updated order:", {
      id: updatedOrder._id,
      status: updatedOrder.status,
      orderDate: updatedOrder.orderDate,
      receiveDate: updatedOrder.receiveDate,
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

export { getOrders, createOrder, updateOrderStatus, deleteOrder };
