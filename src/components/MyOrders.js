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

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const email = sessionStorage.getItem("email");

  // =================== Fetch user's orders ===================

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/orders");
        const myOrders = res.data.filter(
          (order) => order.customerEmail?.toLowerCase() === email?.toLowerCase()
        );
        setOrders(myOrders);
      } catch (err) {
        console.error("Failed to fetch user's orders:", err);
      }
    };

    if (email) fetchMyOrders();
  }, [email]);

  // =================== Delete a single order ===================
  
  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/api/orders/${id}`);
      const updatedOrders = orders.filter((order) => order._id !== id);
      setOrders(updatedOrders);
      Swal.fire("Removed!", "Your order has been removed.", "success");
    } catch (error) {
      console.error("Failed to remove order:", error);
      Swal.fire("Error", "Failed to remove the order.", "error");
    }
  };

  // =================== Format date/time nicely ===================

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // =================== UI ===================

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        mt: { xs: 6, md: 8 },
        width: "100%",
      }}
    >
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
        My Orders
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {orders.length === 0 ? (
        <Typography
          textAlign="center"
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            p: { xs: 2, sm: 3 },
          }}
        >
          You haven’t placed any orders yet.
        </Typography>
      ) : (
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <TableContainer
            component={Card}
            sx={{
              minWidth: { xs: "100%", sm: 750 },
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      textAlign: "center",
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <TableCell>
                    <b>Order ID</b>
                  </TableCell>
                  <TableCell>
                    <b>Date</b>
                  </TableCell>
                  <TableCell>
                    <b>Time</b>
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
                    <b>Payment</b>
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
                    sx={{
                      "& td": {
                        fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        wordBreak: "break-word",
                        verticalAlign: "middle",
                      },
                    }}
                  >
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>{formatTime(order.createdAt)}</TableCell>
                    <TableCell>
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} (x{item.quantity})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>₹{order.total}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.paymentMethod?.toUpperCase()}</TableCell>

                    <TableCell>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          sx={{
                            whiteSpace: "nowrap",
                            flex: 1,
                            minWidth: { xs: "100%", sm: "90px" },
                            fontSize: { xs: "0.75rem", sm: "0.85rem" },
                          }}
                          onClick={() => deleteOrder(order._id)}
                        >
                          Remove
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

export default MyOrders;
