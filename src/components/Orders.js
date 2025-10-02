import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
} from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/orders");
        setOrders(res.data);
        localStorage.setItem("orders", JSON.stringify(res.data));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
  try {
    const res = await axios.put(
      `http://localhost:3000/api/orders/${id}/status`,
      { status }
    );

    const updatedOrders = orders.map((o) =>
      o._id === id ? res.data : o // only check _id
    );

    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    Swal.fire("Updated!", `Order status changed to ${status}.`, "success");
  } catch (error) {
    console.error("Failed to update order status:", error);
    Swal.fire("Error", "Failed to update order status.", "error");
  }
};


  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const mongoId = id.startsWith("temp-") ? null : id;
      if (!mongoId) {
        Swal.fire(
          "Error",
          "This order only exists in localStorage, not in DB.",
          "error"
        );
        return;
      }

      await axios.delete(`http://localhost:3000/api/orders/${mongoId}`);

      const filtered = orders.filter((o) => o._id !== mongoId);
      setOrders(filtered);
      localStorage.setItem("orders", JSON.stringify(filtered));

      Swal.fire("Deleted!", "Order has been deleted.", "success");
    } catch (error) {
      console.error(
        "Failed to delete order:",
        error.response?.data || error.message
      );
      Swal.fire("Error", "Failed to delete order from server.", "error");
    }
  };

  const clearAllOrders = async () => {
    const result = await Swal.fire({
      title: "Clear All Orders?",
      text: "This will remove all orders permanently from DB!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear all!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete("http://localhost:3000/api/orders/clear-all");

      // ✅ Re-fetch from DB after deletion
      const res = await axios.get("http://localhost:3000/api/orders");
      setOrders(res.data);
      localStorage.setItem("orders", JSON.stringify(res.data));

      Swal.fire("Cleared!", "All orders have been removed.", "success");
    } catch (error) {
      console.error("Failed to clear orders:", error);
      Swal.fire("Error", "Failed to clear orders from server.", "error");
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, mt: { xs: 6, md: 8 } }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", md: "2rem" },
          textAlign: "center",
          paddingTop: { xs: "30px", md: "0px" },
        }}
      >
        Orders Management
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* ✅ Clear All Orders Button */}
      {orders.length > 0 && (
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button variant="contained" color="error" onClick={clearAllOrders}>
            Clear All Orders
          </Button>
        </Box>
      )}

      {orders.length === 0 ? (
        <Typography textAlign="center">No orders found.</Typography>
      ) : (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <TableContainer component={Card} sx={{ minWidth: 650 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Order ID</b>
                  </TableCell>
                  <TableCell>
                    <b>User</b>
                  </TableCell>
                  <TableCell>
                    <b>Items</b>
                  </TableCell>
                  <TableCell>
                    <b>Total</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id || order._id}
                    sx={{ "& td": { wordBreak: "break-word" } }}
                  >
                    <TableCell>{order.id || order._id}</TableCell>
                    <TableCell>{order.userEmail}</TableCell>
                    <TableCell>
                      {order.items.map((i) => (
                        <div key={i.name}>
                          {i.name} (x{i.quantity})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>₹{order.total}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#198754",
                            "&:hover": { backgroundColor: "#157347" },
                          }}
                          onClick={() =>
                            updateStatus(order.id || order._id, "Approved")
                          }
                          fullWidth
                        >
                          Approve
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#dc3545",
                            "&:hover": { backgroundColor: "#bb2d3b" },
                          }}
                          onClick={() =>
                            updateStatus(order.id || order._id, "Rejected")
                          }
                          fullWidth
                        >
                          Reject
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#6f42c1",
                            "&:hover": { backgroundColor: "#5a379b" },
                          }}
                          onClick={() => deleteOrder(order.id || order._id)}
                          fullWidth
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Orders;
