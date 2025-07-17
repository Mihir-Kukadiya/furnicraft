import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { useFavorites } from "./FavoritesProvider";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();

  const parsePrice = (price) => parseInt(price.replace(/[^\d]/g, ""));

  return (
    <Box
      sx={{
        pt: { xs: 10, md: 13 },
        pb: { xs: 10, md: 13 },
        px: { xs: 2, md: 5 },
      }}
    >
      <Typography variant="h3" fontWeight="bold" mb={4}>
        Your Favorites
      </Typography>

      {favorites.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No favorite items yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((item, index) => {
            const priceValue = parsePrice(item.price);
            const isExpensive = priceValue > 100000;

            return (
              <Grid
                item
                xs={12}
                key={index}
                sx={{
                  p: 3,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  boxShadow: 3,
                  backgroundColor: "#fff",
                  position: "relative",
                  width: '100%'
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <FavoriteIcon
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      fontSize: "30px",
                      color: "red",
                      zIndex: 2,
                    }}
                  />

                  {isExpensive && (
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 80,
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

                  <Card
                    sx={{
                      borderRadius: 3,
                      display: "flex",
                      gap: "20px",
                      boxShadow: "none",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.img}
                      alt={item.name}
                      sx={{
                        objectFit: "cover",
                        height: "200px",
                        width: "250px",
                        borderRadius: "20px",
                      }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h5">{item.name}</Typography>
                      <Typography color="text.secondary" mb={2}>
                        {item.price}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeFavorite(item)}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;
