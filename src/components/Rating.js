import React, { useState, useEffect } from "react";
import { Box, Rating as MuiRating, Typography, Snackbar, Alert } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

const Rating = ({ productId, productType = "regular" }) => {
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [hover, setHover] = useState(-1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const userEmail = sessionStorage.getItem("email");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (productId) {
      fetchRating();
    }
  }, [productId]);

  const fetchRating = async () => {
    try {
      const config = {};
      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }
      const response = await axiosInstance.get(
        `/ratings/${productId}/${productType}`,
        config
      );
      if (response.data) {
        setAverageRating(response.data.averageRating || 0);
        setTotalRatings(response.data.totalRatings || 0);
        if (response.data.userRating) {
          setRating(response.data.userRating);
        }
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!userEmail) {
      setSnackbar({
        open: true,
        message: "Please login to rate this product",
        severity: "warning",
      });
      return;
    }

    if (!newValue) return;

    try {
      const response = await axiosInstance.post(
        "/ratings",
        {
          productId,
          rating: newValue,
          productType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setRating(newValue);
        setAverageRating(response.data.averageRating);
        setTotalRatings(response.data.totalRatings);
        setSnackbar({
          open: true,
          message: "Thank you for rating!",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit rating",
        severity: "error",
      });
    }
  };

  const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? "s" : ""}`;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Rate this product:
      </Typography>
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <MuiRating
          value={rating}
          onChange={handleRatingChange}
          onChangeActive={(event, newHover) => setHover(newHover)}
          getLabelText={getLabelText}
          precision={0.5}
        />
        {/* {averageRating > 0 && (
          <Typography variant="body2" color="text.secondary">
            ({averageRating.toFixed(1)} / 5 from {totalRatings} reviews)
          </Typography>
        )} */}
      </Box>

      {hover !== -1 && (
        <Typography variant="caption" color="text.secondary">
          {getLabelText(hover)}
        </Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Rating;
