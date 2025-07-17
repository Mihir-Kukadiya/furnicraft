import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Button,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "./CartProvider";

const Cart = () => {
  const { cartItems, setCartItems } = useCart();

  const handleQuantityChange = (index, delta) => {
    const updated = cartItems.map((item, i) =>
      i === index
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCartItems(updated);
  };

  const removeFromCart = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const qty = item.quantity || 1;
    const price = parseInt(item.price.replace(/[^\d]/g, "")) || 0;
    return sum + qty * price;
  }, 0);

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 13 },
        pb: { xs: 10, md: 13 },
        px: { xs: 2, md: 5 },
      }}
    >
      <Typography variant="h3" mb={3} fontWeight="bold">
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography variant="body1">No items in your cart.</Typography>
      ) : (
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} md={8} sx={{ width: "61%" }}>
            <Stack spacing={3}>
              {cartItems.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ position: "relative" }}
                  >
                    <Grid item xs={12} sm={3} sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        image={item.img}
                        alt={item.name}
                        sx={{
                          width: "300px",
                          height: "250px",
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                      {parseInt(item.price.replace(/[^\d]/g, "")) > 100000 && (
                        <Typography
                          variant="caption"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 740,
                            backgroundColor: "#FFD700",
                            color: "#000",
                            fontWeight: "bold",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "5px",
                            fontSize: "14px",
                            zIndex: 2,
                          }}
                        >
                          Expensive
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <CardContent sx={{ p: 0 }}>
                        <Typography variant="h5" fontWeight="bold">
                          {item.name}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ pt: 2, fontSize: "1.2rem" }}
                        >
                          {item.price}
                        </Typography>
                      </CardContent>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={2}
                      sx={{
                        position: "absolute",
                        right: "70px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          onClick={() => handleQuantityChange(index, -1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography>{item.quantity || 1}</Typography>
                        <IconButton
                          onClick={() => handleQuantityChange(index, 1)}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={2}
                      sx={{
                        position: "absolute",
                        right: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              position: "fixed",
              right: "20px",
              width: "37%",
            }}
          >
            <Box
              sx={{
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                height: "538px",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#f9f9f9",
                flexGrow: "1",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  maxHeight: "400px", // Adjust height as needed
                  pr: 1,
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {cartItems.map((item, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="body2">
                      {item.name} × {item.quantity || 1}
                    </Typography>
                    <Typography variant="body2">
                      ₹
                      {(
                        (parseInt(item.price.replace(/[^\d]/g, "")) || 0) *
                        (item.quantity || 1)
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{totalPrice.toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Cart;
