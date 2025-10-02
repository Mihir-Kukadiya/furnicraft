import { React, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import ReactImageMagnify from "react-image-magnify";

const ProductDetail = ({
  open,
  onClose,
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}) => {
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  if (!product) return null;

  const userEmail = sessionStorage.getItem("email");
  const isAdmin = sessionStorage.getItem("isAdmin") === "true";
  const isLoggedInUser = userEmail && !isAdmin;

  const handleAddToCart = () => {
    if (isLoggedInUser) {
      onAddToCart?.(product);
    } else if (isAdmin) {
      setSnackbarMessage("Admin cannot add items to cart");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Please log in to add items to your cart");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const handleToggleFavorite = () => {
    if (isLoggedInUser) {
      onToggleFavorite?.(product);
    } else if (isAdmin) {
      setSnackbarMessage("Admin cannot add items to favorites");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Please log in to manage favorites");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const favorited = isFavorite?.(product);

  return (
    <>
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

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "800px", md: "1150px" },
            borderRadius: { xs: 0, sm: 3 },
          },
        }}
      >
        <DialogContent
          sx={{
            padding: "20px 20px 0 20px",
          }}
        >
          <Box
            display="flex"
            gap={4}
            flexDirection={{ xs: "column", md: "row" }}
          >
            <Box
              sx={{
                width: { xs: "100%", md: "550px" },
                height: { xs: "auto", md: "550px" },
                flexShrink: 0,
                position: "relative",
                zIndex: 2,
              }}
            >
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: product.name,
                    isFluidWidth: true,
                    src: product.img,
                  },
                  largeImage: {
                    src: product.img,
                    width: 1200,
                    height: 1800,
                  },
                  enlargedImageContainerStyle: {
                    zIndex: 999,
                    background: "#fff",
                  },
                  isHintEnabled: true,
                }}
              />
            </Box>

            <Box flex={1} position="relative">
              <IconButton
                onClick={handleToggleFavorite}
                color={favorited ? "error" : "default"}
                sx={{
                  p: 0,
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                {favorited ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "30px",
                  fontWeight: "700",
                  mt: "30px",
                  p: 0,
                }}
              >
                {product.name}
              </DialogTitle>
              <Typography variant="h6" gutterBottom sx={{ pt: "10px" }}>
                Price: ₹{Number(product.price).toLocaleString("en-IN")}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ pt: "10px" }}
              >
                {product.description}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "stretch",
            gap: 1.5,
          }}
        >
          <Button
            fullWidth
            onClick={handleAddToCart}
            color="primary"
            variant="outlined"
          >
            Add to Cart
          </Button>
          <Button
            fullWidth
            onClick={onClose}
            color="error"
            variant="outlined"
            className="m-0"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetail;
