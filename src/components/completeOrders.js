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
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const CompleteOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders");

        const completed = res.data.filter(
          (order) => order.status === "Completed",
        );

        const formatted = completed.map((order) => ({
          ...order,
          customerEmail: order.customerEmail || order.userEmail || "N/A",
        }));

        setOrders(formatted);
      } catch (err) {
        console.error("Failed to fetch completed orders:", err);
      }
    };

    fetchCompletedOrders();
  }, []);

  // ======================= date =======================

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  // =====================================================

  return (
    <Box sx={{ p: 2, mt: 8 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        Completed Orders
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box textAlign="right" mb={2}>
        <Button variant="contained" onClick={() => navigate("/orders")}>
          Back to All Orders
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Typography textAlign="center">No completed orders found.</Typography>
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

                    <Chip label="Completed" color="success" />
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    📅 Completed:{" "}
                    {formatDate(order.completedAt || order.updatedAt)}
                  </Typography>

                  <Typography mt={1}>👤 {order.customerName}</Typography>

                  <Typography>📧 {order.customerEmail}</Typography>

                  {/* ITEMS */}
                  <Box mt={1}>
                    <Typography fontWeight="bold">Items:</Typography>

                    {order.items.map((i, idx) => (
                      <Typography key={idx} variant="body2">
                        • {i.name} (x{i.quantity})
                      </Typography>
                    ))}
                  </Box>

                  <Typography mt={1}>💵 Total: ₹{order.total}</Typography>

                  <Typography variant="body2">📍 {order.address}</Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CompleteOrders;
