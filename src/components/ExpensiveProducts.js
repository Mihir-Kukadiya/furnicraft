import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
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
      category: "sofa",
      description:
        "Handcrafted for discerning tastes, this designer L-shaped sofa boasts custom upholstery, feather-filled cushions, and timeless European styling.",
    },
    {
      name: "Gold Skull Armchair",
      price: "₹4,27,42,750",
      img: expensivechair,
      category: "chair",
      description:
        "A bold fusion of art and furniture, this limited-edition armchair features gold-plated detailing and a sculpted skull motif—making a statement in any luxury setting.",
    },
    {
      name: "Eden Gold Center Table",
      price: "₹11,00,000",
      img: expensivetable,
      category: "table",
      description:
        "Inspired by nature, this center table features intricate gold leaf designs and a glass top, transforming any room into a work of art.",
    },
  ];

  // ============================== cart  ===============================

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

  // ====================================================================

  return (
    <Box
      id="expensive"
      sx={{
        p: 3,
        height: "100vh",
        paddingTop: "90px",
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

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={5}
        sx={{ textAlign: "center", fontSize: "45px" }}
      >
        Elite Picks
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          flexWrap: "nowrap",
          overflowX: "auto",
          pb: 3,
        }}
      >
        {expensiveProducts.map((product, index) => (
          <Card
            key={index}
            onClick={() => handleOpenProduct(product)}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderRadius: 3,
              border: "1px solid #ccc",
              boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <CardMedia
              component="img"
              height="250"
              image={product.img}
              alt={product.name}
              sx={{ objectFit: "cover", height: "370px" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {product.name}
              </Typography>
              <Typography color="text.secondary" mb={2}>
                {product.price}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
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
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                  >
                    {isFavorited(product) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>
        ))}
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
