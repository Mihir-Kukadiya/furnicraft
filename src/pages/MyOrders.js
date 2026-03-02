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
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";
import axiosInstance from "../utils/axiosInstance";
import Rating from "../components/Rating";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const email = sessionStorage.getItem("email");
  const [ratings, setRatings] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

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

  // =================== Submit Rating ===================

  const handleRatingChange = (orderId, itemIndex, value) => {
    setRatings((prev) => ({
      ...prev,
      [`${orderId}-${itemIndex}`]: value,
    }));
  };

  const handleFeedbackChange = (orderId, itemIndex, value) => {
    setFeedbacks((prev) => ({
      ...prev,
      [`${orderId}-${itemIndex}`]: value,
    }));
  };

  const submitRatingAndFeedback = async (orderId, itemIndex, productId) => {
    const rating = ratings[`${orderId}-${itemIndex}`];
    const feedback = feedbacks[`${orderId}-${itemIndex}`] || "";

    if (!rating) {
      Swal.fire("Warning", "Please select a rating before submitting.", "warning");
      return;
    }

    try {
      await axiosInstance.post("/ratings/order-item", {
        orderId,
        itemIndex,
        rating,
        feedback,
      });

      Swal.fire("Success!", "Thank you for your feedback!", "success");

      // Refresh orders to show updated rating/feedback
      const res = await axiosInstance.get("/orders");
      const myOrders = res.data.filter(
        (order) =>
          order.customerEmail?.toLowerCase() === email?.toLowerCase(),
      );
      setOrders(myOrders);
    } catch (error) {
      console.error("Error submitting rating:", error);
      Swal.fire("Error", "Failed to submit rating. Please try again.", "error");
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
                        <Box key={i} sx={{ mt: 1, mb: 1 }}>
                          <Typography variant="body2">
                            • {item.name} (x{item.quantity})
                          </Typography>

                          {/* Rating Section - Only for Completed Orders */}
                          {order.status === "Completed" && (
                            <Box sx={{ mt: 1, ml: 2 }}>
                              {item.rating ? (
                                <Box>
                                  <Typography variant="body2" color="primary">
                                    You rated this product: {item.rating}/5
                                  </Typography>
                                  {item.feedback && (
                                    <Typography variant="body2" color="text.secondary">
                                      Feedback: {item.feedback}
                                    </Typography>
                                  )}
                                </Box>
                              ) : (
                                <Box>
                                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    Rate this product:
                                  </Typography>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <Rating
                                      productId={item.productId}
                                      productType={item.price > 100000 ? "expensive" : "regular"}
                                      value={ratings[`${order._id}-${i}`] || 0}
                                      onChange={(event, newValue) => {
                                        handleRatingChange(order._id, i, newValue);
                                      }}
                                    />
                                  </Box>
                                  <TextField
                                    label="Feedback (optional)"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={feedbacks[`${order._id}-${i}`] || ""}
                                    onChange={(e) =>
                                      handleFeedbackChange(order._id, i, e.target.value)
                                    }
                                    sx={{ mb: 1 }}
                                  />
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => submitRatingAndFeedback(order._id, i, item.productId)}
                                  >
                                    Submit Rating
                                  </Button>
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
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

                    {/* ACTION - Disable for Completed orders */}
                    <Box textAlign="right" mt={2}>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deleteOrder(order._id)}
                        disabled={order.status === "Completed"}
                      >
                        {order.status === "Completed" ? "Order Completed" : "Cancel Order"}
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
