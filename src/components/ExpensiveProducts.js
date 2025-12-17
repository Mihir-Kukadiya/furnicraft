import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useCart } from "./CartProvider";
import { useFavorites } from "./FavoritesProvider";
import expensivesofa from "../images/ExpensiveProducts/sofa.jpg";
import expensivechair from "../images/ExpensiveProducts/chair.jpg";
import expensivetable from "../images/ExpensiveProducts/table.jpg";
import ProductDetail from "./ProductDetail";

const ExpensiveProducts = () => {
  // ========================= expensive products ==========================

  const expensiveProducts = [
    {
      name: "L shaped Boutique sofa",
      price: "₹2,11,860",
      img: expensivesofa,
      description:
        "Handcrafted for discerning tastes, this designer L-shaped sofa boasts custom upholstery, feather-filled cushions, and timeless European styling.",
    },
    {
      name: "Luxury Gold Chair",
      price: "₹4,27,42,750",
      img: expensivechair,
      description:
        "A bold fusion of art and furniture, this limited-edition Luxury Gold Chair features gold-plated detailing and a sculpted motif—making a statement in any luxury setting.",
    },
    {
      name: "Luxury Gold Stainless Steel Frame Marble Table",
      price: "₹11,00,000",
      img: expensivetable,
      description:
        "Inspired by nature, this center table features intricate gold leaf designs and a glass top, transforming any room into a work of art.",
    },
  ];

  // ============================== cart ===============================

  const { addToCart, message } = useCart();

  // ========================= product popup ============================

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenProduct = (product) => setSelectedProduct(product);
  const handleCloseProduct = () => setSelectedProduct(null);

  useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  // ========================= favorites ============================

  const { favorites, toggleFavorite } = useFavorites();

  const isFavorited = (product) =>
    favorites.some((fav) => fav.name === product.name);

  // ============== without login not add products in cart ===========

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // ====================================================================

  return (
    <Box
      id="expensive"
      sx={{
        p: 3,
        height: "auto",
        paddingTop: {xs: "10px", md: "20px"},
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={message.includes("already") ? "warning" : "success"}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={5}
        sx={{ textAlign: "center", fontSize: { xs: "2rem", md: "2.5rem" } }}
      >
        Elite Picks
      </Typography>

      <Box sx={{ width: "100%" }}>
        {(() => {
          const cardsPerRow = 3;
          const rows = [];
          for (let i = 0; i < expensiveProducts.length; i += cardsPerRow) {
            rows.push(expensiveProducts.slice(i, i + cardsPerRow));
          }
          return rows.map((row, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "center",
                mb: 3,
              }}
            >
              {row.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: "1 1 300px",
                    maxWidth: "100%",
                    minWidth: "280px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpenProduct(product)}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
                      border: "1px solid #ccc",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.img}
                      alt={product.name}
                      sx={{
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        height: { xs: 220, sm: 280, md: 320, lg: 350 },
                        width: "100%",
                        transition: "0.3s ease",
                      }}
                    />

                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {product.name}
                        </Typography>
                        <Typography color="text.secondary" mb={1}>
                          {product.price}
                        </Typography>
                      </Box>

                      <Box
                        mt="auto"
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            const userEmail = sessionStorage.getItem("email");
                            const isAdmin =
                              sessionStorage.getItem("isAdmin") === "true";

                            if (userEmail && !isAdmin) {
                              addToCart(product);
                            } else if (isAdmin) {
                              setSnackbarMessage(
                                "Admin cannot add items to cart"
                              );
                              setSnackbarSeverity("warning");
                              setOpenSnackbar(true);
                            } else {
                              setSnackbarMessage(
                                "Please log in to add items to your cart"
                              );
                              setSnackbarSeverity("warning");
                              setOpenSnackbar(true);
                            }
                          }}
                        >
                          Add to Cart
                        </Button>

                        <Tooltip
                          title={
                            isFavorited(product)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <Tooltip
                            title={
                              isFavorited(product)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            <IconButton
                              color={isFavorited(product) ? "error" : "default"}
                              onClick={(e) => {
                                e.stopPropagation();
                                const userEmail =
                                  sessionStorage.getItem("email");
                                const isAdmin =
                                  sessionStorage.getItem("isAdmin") === "true";

                                if (userEmail && !isAdmin) {
                                  toggleFavorite(product);
                                } else if (isAdmin) {
                                  setSnackbarMessage(
                                    "Admin cannot add items in favorites"
                                  );
                                  setSnackbarSeverity("warning");
                                  setOpenSnackbar(true);
                                } else {
                                  setSnackbarMessage(
                                    "Please log in to add items in favorites"
                                  );
                                  setSnackbarSeverity("warning");
                                  setOpenSnackbar(true);
                                }
                              }}
                            >
                              {isFavorited(product) ? (
                                <FavoriteIcon />
                              ) : (
                                <FavoriteBorder />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          ));
        })()}
      </Box>

      <ProductDetail
        open={Boolean(selectedProduct)}
        onClose={handleCloseProduct}
        product={selectedProduct}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
        isFavorite={isFavorited}
      />
    </Box>
  );
};

export default ExpensiveProducts;
