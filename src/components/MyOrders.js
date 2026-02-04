import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  Button,
  Stack,
  Chip,
  Grid,
  CardContent,
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axiosInstance";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const email = sessionStorage.getItem("email");

  // =================== Fetch user's orders ===================

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");

        const myOrders = res.data.filter(
          (order) =>
            order.customerEmail?.toLowerCase() === email?.toLowerCase(),
        );

        setOrders(myOrders);
      } catch (err) {
        console.error("Failed to fetch user's orders:", err);
      }
    };

    if (email) fetchMyOrders();
  }, [email]);

  // =================== Delete ===================

  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently cancelled!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/orders/${id}`);
      setOrders(orders.filter((order) => order._id !== id));

      Swal.fire("Cancelled!", "Your order has been cancelled.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to cancel the order.", "error");
    }
  };

  // =================== Format ===================

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =================== UI ===================

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        mt: 8,
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        My Orders
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ width: "100%", p: 2 }}>
        {orders.length === 0 ? (
          <Typography textAlign="center">
            You haven't placed any orders yet.
          </Typography>
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
                    xs: "100%", // mobile → 1
                    sm: "48%", // tablet → 2
                    md: "48%", // desktop → 2
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

                      <Chip
                        label={order.status}
                        color={
                          order.status === "Completed" ? "success" : "warning"
                        }
                        size="small"
                      />
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    {/* DATES */}
                    <Stack direction="row" gap={2} flexWrap="wrap">
                      <Typography variant="body2">
                        📅 Order: {formatDate(order.orderDate)} |{" "}
                        {formatTime(order.orderDate)}
                      </Typography>

                      <Typography variant="body2">
                        🚚 Receive:{" "}
                        {order.receiveDate
                          ? formatDate(order.receiveDate)
                          : "Not Received"}
                      </Typography>
                    </Stack>

                    {/* ITEMS */}
                    <Box mt={1}>
                      <Typography fontWeight="bold">Items:</Typography>

                      {order.items.map((item, i) => (
                        <Typography key={i} variant="body2">
                          • {item.name} (x{item.quantity})
                        </Typography>
                      ))}
                    </Box>

                    {/* INFO */}
                    <Stack mt={1}>
                      <Typography>
                        💳 Payment: {order.paymentMethod?.toUpperCase()}
                      </Typography>

                      <Typography>💵 Total: ₹{order.total}</Typography>

                      <Typography variant="body2">
                        📍 {order.address}
                      </Typography>
                    </Stack>

                    {/* ACTION */}
                    <Box textAlign="right" mt={2}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deleteOrder(order._id)}
                      >
                        Cancel Order
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyOrders;
