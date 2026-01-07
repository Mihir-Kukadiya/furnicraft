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
import emailjs from "emailjs-com";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // ======================= fetch orders from backend =======================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/orders");
        const pendingOrders = res.data.filter(
          (order) => order.status === "Pending"
        );
        setOrders(pendingOrders);
        localStorage.setItem("orders", JSON.stringify(pendingOrders));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // ======================= update order status [ Complete ] =======================

  const markAsCompleted = async (order) => {
    try {
      await axios.put(`http://localhost:3000/api/orders/${order._id}/status`, {
        status: "Completed",
      });

      await emailjs.send(
        "service_xtmr7ji",
        "template_rgik6v6",
        {
          to_email: order.customerEmail,
          customer_name: order.customerName,
          order_id: order._id,
          order_total: order.total,
        },
        "j4TLiqXB52zF5dvpD"
      );

      const updatedOrders = orders.filter((o) => o._id !== order._id);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      Swal.fire(
        "Completed!",
        "Order completed & email sent to customer.",
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Order updated but email failed to send.", "warning");
    }
  };

  // ======================= delete order =======================

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
      await axios.delete(`http://localhost:3000/api/orders/${id}`);

      const filtered = orders.filter((o) => o._id !== id);
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

  // ======================= date =======================

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  // =======================================================================

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
        Pending Orders
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          textAlign: { xs: "center", sm: "right" },
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/completed-orders")}
          sx={{
            width: { xs: "100%", sm: "auto" },
            maxWidth: "200px",
          }}
        >
          Completed Orders
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Typography textAlign="center">No pending orders found.</Typography>
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
                    <b>Date</b>
                  </TableCell>

                  <TableCell>
                    <b>Customer Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Customer Email</b>
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
                    <b>Address</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order._id}
                    sx={{ "& td": { wordBreak: "break-word" } }}
                  >
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {formatDate(order.createdAt || new Date())}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerEmail}</TableCell>
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
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 220,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {order.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems="stretch"
                        sx={{ minWidth: 120 }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#0d6efd",
                            "&:hover": { backgroundColor: "#0b5ed7" },
                            whiteSpace: "nowrap",
                            flex: 1,
                            minWidth: "90px",
                          }}
                          onClick={() => markAsCompleted(order)}
                        >
                          Complete
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#6f42c1",
                            "&:hover": { backgroundColor: "#5a379b" },
                            whiteSpace: "nowrap",
                            flex: 1,
                            minWidth: "90px",
                          }}
                          onClick={() => deleteOrder(order._id)}
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
