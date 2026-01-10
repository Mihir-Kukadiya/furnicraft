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
          (order) => order.status === "Completed"
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
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
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
        Completed Orders
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
          color="primary"
          onClick={() => navigate("/orders")}
          sx={{
            width: { xs: "100%", sm: "auto" },
            maxWidth: "200px",
          }}
        >
          Back to All Orders
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Typography textAlign="center">No completed orders found.</Typography>
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
                    <b>Completed Date</b>
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
                    <b>Address</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>
                      {formatDate(order.completedAt || order.updatedAt)}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.customerEmail}</TableCell>
                    <TableCell>
                      {order.items.map((i, idx) => (
                        <div key={idx}>
                          {i.name} (x{i.quantity})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>₹{order.total}</TableCell>
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

export default CompleteOrders;
