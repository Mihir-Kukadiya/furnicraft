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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import { useCart } from "./CartProvider";
import axiosInstance from "../utils/axiosInstance";
import { useFavorites } from "./FavoritesProvider";
import { useTheme } from "@mui/material/styles";
import ProductDetail from "./ProductDetail";
import { useFilters } from "./FiltersContext";
import { Favorite } from "@mui/icons-material";

const ExpensiveProducts = () => {
  const theme = useTheme();
  // ============================== cart ===============================

  const { addToCart, message } = useCart();

  // ============================== fetch products data ===============================

  const [expensiveProducts, setExpensiveProducts] = useState([]);
  const role = sessionStorage.getItem("role"); // "admin" | "user"
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchExpensiveProducts = async () => {
      try {
        const res = await axiosInstance.get("/expensive-products");

        const sortedByPrice = [...res.data].sort(
          (a, b) => Number(b.price) - Number(a.price)
        );

        setExpensiveProducts(sortedByPrice);
      } catch (err) {
        console.error("Failed to fetch expensive products", err);
      }
    };

    fetchExpensiveProducts();
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    img: "",
    category: "",
    description: "",
  });

  const [editProduct, setEditProduct] = useState(null);

  // ============================== filters ===============================

  const { category, searchQuery, sort } = useFilters();

  const filteredProducts = expensiveProducts.filter((product) => {
    const inCategory =
      category === "All" ||
      product.category?.toLowerCase() === category.toLowerCase();

    const inSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return inCategory && inSearch;
  });

  const sortedExpensiveProducts = [...filteredProducts];

  if (sort === "lowtohigh") {
    sortedExpensiveProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "hightolow") {
    sortedExpensiveProducts.sort((a, b) => b.price - a.price);
  }

  // ========================= product popup ============================

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenProduct = (product) => setSelectedProduct(product);
  const handleCloseProduct = () => setSelectedProduct(null);

  useEffect(() => {
    if (message) setOpen(true);
  }, [message]);

  // ========================= favorites ============================

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorited = (product) =>
    favorites.some((fav) => fav.productId === product._id);

  // ============== without login not add products in cart ===========

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // ====================================================================

  return (
    <>
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: "background.paper",
            width: "600px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.6rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "text.primary",
          }}
        >
          Add New Product
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: { xs: 2, sm: 4 },
            py: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 4,
              alignItems: { xs: "center", sm: "flex-start" },
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Image URL"
                value={newProduct.img}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, img: e.target.value })
                }
                fullWidth
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              />
              <TextField
                label="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                fullWidth
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              />
              <TextField
                label="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                fullWidth
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              />
              <FormControl
                fullWidth
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={newProduct.category}
                  label="Category"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                >
                  <MenuItem value="Chairs">Chairs</MenuItem>
                  <MenuItem value="Sofas">Sofas</MenuItem>
                  <MenuItem value="Tables">Tables</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                fullWidth
                multiline
                rows={3}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              />

              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    const res = await axiosInstance.post(
                      "/expensive-products",
                      { ...newProduct, price: Number(newProduct.price) }
                    );

                    setExpensiveProducts((prev) => [...prev, res.data]);

                    setNewProduct({
                      name: "",
                      price: "",
                      img: "",
                      category: "",
                      description: "",
                    });

                    setIsAddDialogOpen(false);
                  } catch (error) {
                    console.error("Failed to add product", error);
                  }
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: "background.paper",
            width: "600px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.6rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "text.primary",
          }}
        >
          Edit Product
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: { xs: 2, sm: 4 },
            py: 3,
          }}
        >
          {editProduct && (
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 4,
                alignItems: { xs: "center", sm: "flex-start" },
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "100%",
                }}
              >
                <TextField
                  label="Image URL"
                  value={editProduct.img}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, img: e.target.value })
                  }
                  fullWidth
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    input: { color: theme.palette.text.primary },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                  }}
                />

                <TextField
                  label="Product Name"
                  value={editProduct.name}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, name: e.target.value })
                  }
                  fullWidth
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    input: { color: theme.palette.text.primary },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                  }}
                />

                <TextField
                  label="Price"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                  fullWidth
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    input: { color: theme.palette.text.primary },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                  }}
                />

                <FormControl
                  fullWidth
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <InputLabel
                    id="edit-category-label"
                    category
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="edit-category-label"
                    value={editProduct.category}
                    label="Category"
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="Chairs">Chairs</MenuItem>
                    <MenuItem value="Sofas">Sofas</MenuItem>
                    <MenuItem value="Tables">Tables</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Description"
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value,
                    })
                  }
                  fullWidth
                  multiline
                  rows={3}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    input: { color: theme.palette.text.primary },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                  }}
                />

                <Button
                  variant="contained"
                  onClick={async () => {
                    const res = await axiosInstance.put(
                      `/expensive-products/${editProduct._id}`,
                      { ...editProduct, price: Number(editProduct.price) }
                    );
                    setExpensiveProducts((prev) =>
                      prev.map((p) =>
                        p._id === editProduct._id ? res.data : p
                      )
                    );
                    setIsEditDialogOpen(false);
                  }}
                  sx={{
                    mt: 1,
                    py: 1.2,
                    fontSize: "15px",
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    borderRadius: "30px",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Box
        id="expensive"
        sx={{
          p: 3,
          height: "auto",
          paddingTop: { xs: "10px", md: "20px" },
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

        <Box
          sx={{
            position: "relative",
            height: "auto",
            mb: 5,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              textAlign: "center",
              fontSize: { xs: "2rem", md: "2.5rem" },
              mb: { xs: 7, md: 3 },
            }}
          >
            Elite Picks
          </Typography>

          {isAdmin && (
            <Button
              sx={{
                position: "absolute",
                top: { xs: "0px", md: "40px" },
                right: "0px",
                transition: ".3s",
                fontWeight: "bold",
                marginTop: { xs: "47px", md: "0" },
              }}
              variant="outlined"
              onClick={() => {
                setNewProduct({
                  name: "",
                  price: "",
                  img: "",
                  category: "",
                  description: "",
                });
                setIsAddDialogOpen(true);
              }}
            >
              + Add Item
            </Button>
          )}
        </Box>

        <Box sx={{ width: "100%" }}>
          {(() => {
            const cardsPerRow = 3;
            const rows = [];
            for (
              let i = 0;
              i < sortedExpensiveProducts.length;
              i += cardsPerRow
            ) {
              rows.push(sortedExpensiveProducts.slice(i, i + cardsPerRow));
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
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            mt: "auto",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              const userEmail = sessionStorage.getItem("email");

                              if (!userEmail) {
                                setSnackbarMessage(
                                  "Please log in to add items to your cart"
                                );
                                setSnackbarSeverity("warning");
                                setOpenSnackbar(true);
                                return;
                              }

                              if (isAdmin) {
                                setSnackbarMessage(
                                  "Admin cannot add items to cart"
                                );
                                setSnackbarSeverity("warning");
                                setOpenSnackbar(true);
                                return;
                              }

                              addToCart(product);
                            }}
                          >
                            Add to Cart
                          </Button>
                          <Box>
                            {isAdmin && (
                              <>
                                <Tooltip title="Remove">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      axiosInstance
                                        .delete(
                                          `/expensive-products/${product._id}`
                                        )

                                        .then(() => {
                                          setExpensiveProducts((prev) =>
                                            prev.filter(
                                              (p) => p._id !== product._id
                                            )
                                          );
                                          setSnackbarMessage(
                                            "Product deleted successfully"
                                          );
                                          setSnackbarSeverity("success");
                                          setOpenSnackbar(true);
                                        })
                                        .catch(() => {
                                          setSnackbarMessage(
                                            "Failed to delete product"
                                          );
                                          setSnackbarSeverity("error");
                                          setOpenSnackbar(true);
                                        });
                                    }}
                                    sx={{
                                      marginRight: { xs: "0", md: "10px" },
                                      color: "#f44336",
                                      fontSize: "20px",
                                    }}
                                  >
                                    <FaRegTrashAlt />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditProduct(product);
                                      setIsEditDialogOpen(true);
                                    }}
                                    sx={{
                                      marginRight: { xs: "0", md: "10px" },
                                      color:
                                        theme.palette.mode === "dark"
                                          ? "#fff"
                                          : "#000",
                                      fontSize: "23px",
                                    }}
                                  >
                                    <MdEdit />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip
                              title={
                                isFavorited(product)
                                  ? "Remove from favorites"
                                  : "Add to favorites"
                              }
                            >
                              <IconButton
                                color={
                                  isFavorited(product) ? "error" : "default"
                                }
                                sx={{
                                  color: isFavorited(product)
                                    ? theme.palette.error.main
                                    : theme.palette.mode === "dark"
                                    ? "#fff"
                                    : "#000",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const userEmail =
                                    sessionStorage.getItem("email");

                                  if (!userEmail) {
                                    setSnackbarMessage(
                                      "Please log in to add items to favorites"
                                    );
                                    setSnackbarSeverity("warning");
                                    setOpenSnackbar(true);
                                    return;
                                  }

                                  if (isAdmin) {
                                    setSnackbarMessage(
                                      "Admin cannot add items in favorites"
                                    );
                                    setSnackbarSeverity("warning");
                                    setOpenSnackbar(true);
                                    return;
                                  }

                                  if (isFavorited(product)) {
                                    removeFavorite({ productId: product._id });
                                  } else {
                                    addFavorite(product);
                                  }
                                }}
                              >
                                {isFavorited(product) ? (
                                  <Favorite />
                                ) : (
                                  <FavoriteBorder />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
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
          onAddFavorite={addFavorite}
          onRemoveFavorite={removeFavorite}
          isFavorite={isFavorited}
        />
      </Box>
    </>
  );
};

export default ExpensiveProducts;
