import React, { useEffect, useState } from "react";
import saleImg from "../images/Products/sale.jpg";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "@mui/material/styles";
import { MdEdit } from "react-icons/md";
import { useFilters } from "./FiltersContext";
import { Tooltip } from "@mui/material";
import { Rating } from "@mui/material";
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
    arr.slice(i * size, i * size + size),
  );

// =============================================================

const Products = () => {
  const theme = useTheme();

  // ======================= product popup ========================

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenProduct = (product) => setSelectedProduct(product);

  const handleCloseProduct = async () => {
    if (selectedProduct?._id) {
      await fetchProductRating(selectedProduct._id, "regular");
    }
    setSelectedProduct(null);
  };

  // ================= Load products from MongoDB ==================

  const [productsData, setProductsData] = useState([]);
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => {
        setProductsData(res.data);
        // Fetch ratings for all products
        res.data.forEach((product) => {
          fetchProductRating(product._id, "regular");
        });
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchProductRating = async (productId, productType) => {
    try {
      const token = sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axiosInstance.get(
        `/ratings/${productId}/${productType}`,
        config
      );
      if (response.data) {
        setProductRatings((prev) => ({
          ...prev,
          [productId]: {
            averageRating: response.data.averageRating || 0,
            totalRatings: response.data.totalRatings || 0,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

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

  const role = sessionStorage.getItem("role");
  const isAdmin = role === "admin";

  // ========================= add product popup =========================

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

  const {
    addFavorite,
    removeFavorite,
    isFavorite,
    message: favMsg,
  } = useFavorites();

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
        parseInt(String(b.price).replace(/[^\d]/g, "")),
    );
  } else if (sort === "hightolow") {
    sortedProducts.sort(
      (a, b) =>
        parseInt(String(b.price).replace(/[^\d]/g, "")) -
        parseInt(String(a.price).replace(/[^\d]/g, "")),
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
              <Button variant="outlined" component="label">
                Choose Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, img: e.target.files[0] })
                  }
                />
              </Button>

              {newProduct.img && newProduct.img.name && (
                <Typography sx={{ mt: 1 }}>
                  Selected: {newProduct.img.name}
                </Typography>
              )}

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
                    const formData = new FormData();

                    formData.append("name", newProduct.name);
                    formData.append("price", newProduct.price);
                    formData.append("category", newProduct.category);
                    formData.append("description", newProduct.description);

                    // IMPORTANT – send FILE, not cloudinary URL
                    formData.append("img", newProduct.img);

                    const res = await axiosInstance.post(
                      "/products",
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      },
                    );

                    setProductsData([...productsData, res.data]);

                    setSnackbarMessage("Product added successfully");
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
                  } catch (err) {
                    console.error(err);
                    setSnackbarMessage(
                      err.response?.data?.message || "Error saving product",
                    );
                    setSnackbarSeverity("error");
                    setOpenSnackbar(true);
                  }
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
                <Button variant="outlined" component="label">
                  Change Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, img: e.target.files[0] })
                    }
                  />
                </Button>

                {editProduct.img instanceof File ? (
                  <Typography sx={{ mt: 1 }}>
                    Selected: {editProduct.img.name}
                  </Typography>
                ) : (
                  <img
                    src={editProduct.img}
                    alt="current"
                    style={{ width: "120px", marginTop: "10px" }}
                  />
                )}

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
                  onClick={async () => {
                    try {
                      const formData = new FormData();

                      formData.append("name", editProduct.name);
                      formData.append("price", editProduct.price);
                      formData.append("category", editProduct.category);
                      formData.append("description", editProduct.description);

                      // only if new file selected
                      if (editProduct.img instanceof File) {
                        formData.append("img", editProduct.img);
                      }

                      const res = await axiosInstance.put(
                        `/products/${editProduct._id}`,
                        formData,
                        {
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        },
                      );

                      setProductsData((prev) =>
                        prev.map((p) =>
                          p._id === editProduct._id ? res.data : p,
                        ),
                      );

                      setSnackbarMessage("Product updated successfully");
                      setSnackbarSeverity("success");
                      setOpenSnackbar(true);

                      setIsEditDialogOpen(false);
                    } catch (err) {
                      console.error(err);
                      setSnackbarMessage(
                        err.response?.data?.message ||
                        "Failed to update product",
                      );
                      setSnackbarSeverity("error");
                      setOpenSnackbar(true);
                    }
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

        <Box sx={{ width: "100%", p: 3 }}>
          {sortedProducts.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                mt: 5,
                fontSize: "1.4rem",
                color: "text.secondary",
                fontWeight: "bold",
              }}
            >
              No products found 😔
              Try changing filters or search keywords.
            </Typography>
          ) : (
            rows.map((row, rowIndex) => (
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

                        {/* Average Rating Display */}
                        {productRatings[product._id] && productRatings[product._id].averageRating > 0 && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Rating
                              value={productRatings[product._id].averageRating}
                              readOnly
                              precision={0.5}
                              size="small"
                            />
                          </Box>
                        )}

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

                              if (!userEmail) {
                                setSnackbarMessage(
                                  "Please log in to add items to cart",
                                );
                                setSnackbarSeverity("warning");
                                setOpenSnackbar(true);
                                return;
                              }

                              if (isAdmin) {
                                setSnackbarMessage(
                                  "Admin cannot add products to cart",
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
                                        .delete(`/products/${product._id}`)
                                        .then(() => {
                                          setProductsData((prev) =>
                                            prev.filter(
                                              (p) => p._id !== product._id,
                                            ),
                                          );
                                          setSnackbarMessage(
                                            "Product deleted successfully",
                                          );
                                          setSnackbarSeverity("success");
                                          setOpenSnackbar(true);
                                        })
                                        .catch((err) => {
                                          console.error(err);
                                          setSnackbarMessage(
                                            err.response?.data?.message ||
                                            "Failed to delete product",
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

                                  if (!userEmail) {
                                    setSnackbarMessage(
                                      "Please log in to use favorites",
                                    );
                                    setSnackbarSeverity("warning");
                                    setOpenSnackbar(true);
                                    return;
                                  }

                                  if (isAdmin) {
                                    setSnackbarMessage(
                                      "Admin cannot add products to favorites",
                                    );
                                    setSnackbarSeverity("warning");
                                    setOpenSnackbar(true);
                                    return;
                                  }

                                  if (isFavorite(product)) {
                                    removeFavorite({ productId: product._id });
                                  } else {
                                    addFavorite(product);
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
            ))
          )}
        </Box>
        <ProductDetail
          open={Boolean(selectedProduct)}
          onClose={handleCloseProduct}
          product={selectedProduct}
          onAddToCart={addToCart}
          onAddFavorite={addFavorite}
          onRemoveFavorite={removeFavorite}
          isFavorite={isFavorite}
          productType="regular"
        />
      </Box>
    </>
  );
};

export default Products;
