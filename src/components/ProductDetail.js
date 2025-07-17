import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CardMedia,
  IconButton,
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
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(product);
  };

  const favorited = isFavorite?.(product);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: { xs: "98%", sm: "800px", md: "1150px" },
          borderRadius: 3,
        },
      }}
    >
      <DialogContent
        sx={{
          padding: "20px 20px 0 20px",
        }}
      >
        <Box display="flex" gap={4} flexDirection={{ xs: "column", md: "row" }}>
          <Box
            sx={{
              width: "550px",
              height: "500px",
              flexShrink: 0,
              overflow: "visible",
              position: "relative",
              zIndex: 2,
            }}
          >

            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: product.name,
                  isFluidWidth: false,
                  src: product.img,
                  width: 550,
                  height: 500,
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
              Price: {product.price}
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

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleAddToCart} color="primary" variant="outlined">
          Add to Cart
        </Button>
        <Button onClick={onClose} color="error" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetail;
