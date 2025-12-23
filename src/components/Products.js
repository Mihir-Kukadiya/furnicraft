import React, { useEffect, useState } from "react";
import saleImg from "../images/Products/sale.jpg";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { MdEdit } from "react-icons/md";
import { useFilters } from "./FiltersContext";
import { Tooltip } from "@mui/material";
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { FaRegTrashAlt } from "react-icons/fa";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useFavorites } from "./FavoritesProvider";
import ProductDetail from "./ProductDetail";
import { Alert, Snackbar } from "@mui/material";
import { useCart } from "./CartProvider";

// ==================== category management =======================

const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// =============================================================

const Products = () => {
  const theme = useTheme();

  // ======================= product popup ========================

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenProduct = (product) => setSelectedProduct(product);
  const handleCloseProduct = () => setSelectedProduct(null);

  // ================= Load products from MongoDB ==================

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((res) => setProductsData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ====================== edit product popup =========================

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const openEditDialog = (product) => {
    setEditProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleEditFieldChange = (field, value) => {
    setEditProduct((prev) => ({ ...prev, [field]: value }));
  };

  // ============================== admin ==============================

  const isAdmin = sessionStorage.getItem("isAdmin") === "true";

  // ========================= add product popup =========================

  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((res) => setProductsData(res.data))
      .catch((err) => console.error(err));
  }, []);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    img: "",
    category: "",
    description: "",
  });

  // ========================= price range ============================

  const [price, setPrice] = useState([0, 50000]);

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  // ========================= favorites ============================

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { toggleFavorite, isFavorite, message: favMsg } = useFavorites();

  React.useEffect(() => {
    if (favMsg) {
      setSnackbarMessage(favMsg);
      setSnackbarSeverity(favMsg.includes("removed") ? "warning" : "info");
      setOpenSnackbar(true);
    }
  }, [favMsg]);

  // ========================= cart ============================

  const { addToCart, message } = useCart();

  React.useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarSeverity(message.includes("already") ? "warning" : "success");
      setOpenSnackbar(true);
    }
  }, [message]);

  // ======================= filter ========================

  const { category, setCategory, searchQuery, setSearchQuery, sort, setSort } =
    useFilters();

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const sortProducts = productsData.filter((product) => {
    const numericPrice = parseInt(String(product.price).replace(/[^\d]/g, ""));

    const inCategory =
      category === "All" ||
      product.category?.toLowerCase() === category.toLowerCase();

    const inPriceRange = numericPrice >= price[0] && numericPrice <= price[1];

    const inSearch = product.name
      ?.toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    return inCategory && inPriceRange && inSearch;
  });

  const sortedProducts = [...sortProducts];

  if (sort === "lowtohigh") {
    sortedProducts.sort(
      (a, b) =>
        parseInt(String(a.price).replace(/[^\d]/g, "")) -
        parseInt(String(b.price).replace(/[^\d]/g, ""))
    );
  } else if (sort === "hightolow") {
    sortedProducts.sort(
      (a, b) =>
        parseInt(String(b.price).replace(/[^\d]/g, "")) -
        parseInt(String(a.price).replace(/[^\d]/g, ""))
    );
  }

  const rows = chunkArray(sortedProducts, 3);

  // =========================================================

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
                onClick={() => {
                  axios
                    .post("http://localhost:3000/api/products", newProduct)
                    .then((res) => {
                      setProductsData([...productsData, res.data]);
                      setSnackbarMessage("Product added");
                      setSnackbarSeverity("success");
                      setOpenSnackbar(true);

                      setNewProduct({
                        name: "",
                        price: "",
                        img: "",
                        category: "",
                        description: "",
                      });
                      setIsAddDialogOpen(false);
                    })
                    .catch((err) => {
                      console.error("Error saving product:", err);
                      setSnackbarMessage("Error saving product");
                      setSnackbarSeverity("error");
                      setOpenSnackbar(true);
                    });
                }}
                sx={{
                  mt: 1,
                  py: 1.2,
                  fontSize: "15px",
                  backgroundColor: "#1976d2",
                  borderRadius: "30px",
                  textTransform: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "#115293",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                  },
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
                  onChange={(e) => handleEditFieldChange("img", e.target.value)}
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
                    handleEditFieldChange("name", e.target.value)
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
                    handleEditFieldChange("price", e.target.value)
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
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    labelId="edit-category-label"
                    value={editProduct.category}
                    label="Category"
                    onChange={(e) =>
                      handleEditFieldChange("category", e.target.value)
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
                    handleEditFieldChange("description", e.target.value)
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
                  onClick={() => {
                    axios
                      .put(
                        `http://localhost:3000/api/products/${editProduct._id}`,
                        editProduct
                      )
                      .then((res) => {
                        setProductsData((prev) =>
                          prev.map((p) =>
                            p._id === editProduct._id ? res.data : p
                          )
                        );
                        setSnackbarMessage("Product updated successfully");
                        setSnackbarSeverity("success");
                        setOpenSnackbar(true);
                        setIsEditDialogOpen(false);
                      })
                      .catch((err) => {
                        console.error(err);
                        setSnackbarMessage("Failed to update product");
                        setSnackbarSeverity("error");
                        setOpenSnackbar(true);
                      });
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
        id="products"
        sx={{
          position: "relative",
          paddingTop: "30px",
          height: "auto",
        }}
      >
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
          mb={{ xs: 2, md: 3 }}
          sx={{
            textAlign: "center",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          All Products
        </Typography>
        {isAdmin && (
          <Button
            variant="outlined"
            onClick={() => setIsAddDialogOpen(true)}
            sx={{
              position: "absolute",
              top: { xs: "20px", md: "70px" },
              right: "20px",
              transition: ".3s",
              fontWeight: "bold",
              marginTop: { xs: "60px", md: "0" },
            }}
          >
            + Add Item
          </Button>
        )}
        <Grid
          container
          spacing={3}
          mb={4}
          className="row"
          sx={{ flexDirection: { xs: "column", md: "row" }, mt: 6 }}
        >
          <Grid
            item
            xs={12}
            md={3}
            className="col"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Paper
              sx={{
                p: 3,
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                margin: "15px",
                bgcolor: "background.paper",
                color: "text.primary",
              }}
            >
              <Typography variant="h4" mb={3}>
                Filters
              </Typography>
              <TextField
                fullWidth
                label="Category"
                select
                value={category}
                onChange={handleCategoryChange}
                sx={{ marginTop: "10px" }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Chairs">Chairs</MenuItem>
                <MenuItem value="Sofas">Sofas</MenuItem>
                <MenuItem value="Tables">Tables</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Sort By"
                select
                value={sort}
                onChange={handleSortChange}
                sx={{ marginTop: "30px" }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="latest">Latest</MenuItem>
                <MenuItem value="popular">Popular</MenuItem>
                <MenuItem value="lowtohigh">Price: Low to High</MenuItem>
                <MenuItem value="hightolow">Price: High to Low</MenuItem>
              </TextField>
              <Typography sx={{ mt: 5 }} gutterBottom>
                Price Range (₹{price[0]} – ₹{price[1]})
              </Typography>
              <Slider
                value={price}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={100000}
                step={500}
              />
            </Paper>
          </Grid>

          <Grid
            item
            xs={12}
            md={9}
            className="col"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                backgroundImage: `url(${saleImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: { xs: 280, sm: 320, md: "100%" },
                position: "relative",
                borderRadius: 3,
                margin: "15px",
                display: "flex",
                alignItems: "center",
                px: { xs: 2, md: 8 },
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  zIndex: 1,
                  borderRadius: 3,
                }}
              />
              <Box sx={{ zIndex: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  Big Furniture Sale!
                </Typography>
                <Typography variant="h6" sx={{ my: 1 }}>
                  Up to 50% Off on Living Room & Bedroom Items
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    const element = document.getElementById("expensive");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            px: 2,
            mt: { xs: -3, sm: 2, md: 3 },
          }}
        >
          <TextField
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "60%", md: "60%" },
              backgroundColor: theme.palette.background.paper,
              borderRadius: 3,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          />
        </Box>

        <Box sx={{ width: "100%", p: 3 }}>
          {rows.map((row, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}
            >
              {row.map((product, colIndex) => (
                <Box
                  key={colIndex}
                  onClick={() => handleOpenProduct(product)}
                  sx={{
                    cursor: "pointer",
                    flex: "1 1 300px",
                    maxWidth: "100%",
                    minWidth: "280px",
                  }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: theme.shadows[3],
                      bgcolor: "background.paper",
                      color: "text.primary",
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
                      <Typography variant="h6" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Typography color="text.secondary" mb={1}>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </Typography>

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
                        <Box>
                          {isAdmin && (
                            <>
                              <Tooltip title="Remove">
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    axios
                                      .delete(
                                        `http://localhost:3000/api/products/${product._id}`
                                      )
                                      .then(() => {
                                        setProductsData((prev) =>
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
                                    openEditDialog(product);
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
                              isFavorite(product)
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            <IconButton
                              color={isFavorite(product) ? "error" : "default"}
                              sx={{
                                color: isFavorite(product)
                                  ? theme.palette.error.main
                                  : theme.palette.mode === "dark"
                                  ? "#fff"
                                  : "#000",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const userEmail =
                                  sessionStorage.getItem("email");
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
                              {isFavorite(product) ? (
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
          ))}
        </Box>
        <ProductDetail
          open={Boolean(selectedProduct)}
          onClose={handleCloseProduct}
          product={selectedProduct}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      </Box>
    </>
  );
};

export default Products;
