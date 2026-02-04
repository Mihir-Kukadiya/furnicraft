import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  Button,
  Stack,
  Chip,
  CardContent,
} from "@mui/material";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  // ======================= fetch orders =======================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");
        const pendingOrders = res.data.filter(
          (order) => order.status === "Pending",
        );

        setOrders(pendingOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // ======================= Complete =======================

  const markAsCompleted = async (order) => {
    try {
      await axiosInstance.put(`/orders/${order._id}/status`, {
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
        "j4TLiqXB52zF5dvpD",
      );

      setOrders(orders.filter((o) => o._id !== order._id));

      Swal.fire(
        "Completed!",
        "Order completed & email sent to customer.",
        "success",
      );
    } catch (error) {
      Swal.fire("Error", "Order updated but email failed.", "warning");
    }
  };

  // ======================= Delete =======================

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
      await axiosInstance.delete(`/orders/${id}`);
      setOrders(orders.filter((o) => o._id !== id));

      Swal.fire("Deleted!", "Order has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete order.", "error");
    }
  };

  // ======================= Date =======================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  // =====================================================

  return (
    <Box sx={{ p: 2, mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Pending Orders
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box textAlign="right" mb={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/completed-orders")}
        >
          Completed Orders
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Typography textAlign="center">No pending orders found.</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {orders.map((order) => (
            <Box
              key={order._id}
              sx={{
                width: {
                  xs: "100%",
                  sm: "48%",
                  md: "48%",
                },
              }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  border: "1px solid #ccc",
                }}
              >
                <CardContent>
                  {/* HEADER */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                  >
                    <Typography fontWeight="bold">
                      Order ID: {order._id}
                    </Typography>

                    <Chip label={order.status} color="warning" />
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    📅 Date: {formatDate(order.createdAt)}
                  </Typography>

                  <Typography mt={1}>👤 {order.customerName}</Typography>

                  <Typography>📧 {order.customerEmail}</Typography>

                  {/* ITEMS */}
                  <Box mt={1}>
                    <Typography fontWeight="bold">Items:</Typography>

                    {order.items.map((i) => (
                      <Typography key={i.name} variant="body2">
                        • {i.name} (x{i.quantity})
                      </Typography>
                    ))}
                  </Box>

                  <Typography mt={1}>💵 Total: ₹{order.total}</Typography>

                  <Typography variant="body2">📍 {order.address}</Typography>

                  {/* ACTIONS */}
                  <Stack
                    direction="row"
                    spacing={1}
                    mt={2}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => markAsCompleted(order)}
                    >
                      Complete
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Orders;
