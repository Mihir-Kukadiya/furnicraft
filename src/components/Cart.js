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
import { useNavigate } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "./CartProvider";

const Cart = () => {

  // ========================== cart items ===============================

  const { cartItems, setCartItems } = useCart();
  const navigate = useNavigate();

  // ============================ set price in numeric ===============================

  const getNumericPrice = (item) => {
    if (typeof item.price === "number") return item.price;
    if (typeof item.price === "string") {
      const n = parseInt(item.price.replace(/[^\d.]/g, ""), 10);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  };

  // ============================ calculate total price ===============================

  const totalPrice = cartItems.reduce((sum, item) => {
    const qty = item.quantity || 1;
    return sum + qty * getNumericPrice(item);
  }, 0);

  // ============================== quantity change ===============================

  const handleQuantityChange = (index, delta) => {
    const updated = cartItems.map((item, i) =>
      i === index
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    setCartItems(updated);
  };

  // =========================== remove items from cart ============================

  const removeFromCart = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
  };

  // ===============================================================================

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 13 },
        pb: { xs: 10, md: 13 },
        px: { xs: 2, md: 5 },
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        mb={4}
        sx={{
          fontSize: { xs: "2rem", md: "2.5rem" },
          textAlign: { xs: "center", md: "left" },
        }}
      >
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.7rem", md: "1rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          No items in your cart.
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ flexDirection: { xs: "column", md: "row" } }}>
          <Grid item xs={12} md={8} sx={{ maxWidth: "100%", flexGrow: 1 }}>
            <Stack spacing={3}>
              {cartItems.map((item, index) => (
                <Card
                  key={index}
                  sx={{
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: 2,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                    p: 2,
                    position: "relative",
                    border: "1px solid #ccc",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.image || item.img}
                    alt={item.name}
                    sx={{
                      height: "200px",
                      width: { xs: "100%", sm: "200px" },
                      borderRadius: 2,
                    }}
                  />

                  <CardContent sx={{ flex: 1, textAlign: { xs: "center", sm: "left" }, pt: { xs: 2, sm: 0 } }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ wordBreak: "break-word" }}>
                      {item.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                      ₹{getNumericPrice(item).toLocaleString("en-IN")}
                    </Typography>
                  </CardContent>

                  {getNumericPrice(item) > 100000 && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
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

                  <Box sx={{ position: { xs: "static", md: "absolute" }, bottom: { md: 10 }, right: { md: 60 }, display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => handleQuantityChange(index, -1)} disabled={(item.quantity || 1) <= 1}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantity || 1}</Typography>
                    <IconButton onClick={() => handleQuantityChange(index, 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ position: "absolute", right: 0, bottom: 10, paddingBottom: { xs: 0.7, md: 0 }, paddingRight: { xs: 1, md: 0 } }}>
                    <IconButton color="error" onClick={() => removeFromCart(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4} sx={{ width: { xs: "100%", md: "100%", lg: "500px" } }}>
            <Box
              sx={{
                p: 3,
                border: "1px solid #ccc",
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                height: { xs: "auto", md: "auto", lg: "500px" },
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#f9f9f9",
                flexGrow: "1",
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "400px", pr: 1 }}>
                <Divider sx={{ mb: 2 }} />

                {cartItems.map((item, i) => (
                  <Box key={i} display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      {item.name} × {item.quantity || 1}
                    </Typography>
                    <Typography variant="body2">
                      ₹{(getNumericPrice(item) * (item.quantity || 1)).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              </Box>

              <Button variant="contained" color="success" size="large" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/payment")}>
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
