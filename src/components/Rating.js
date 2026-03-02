import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Rating as MuiRating, Alert, Snackbar } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

// Props:
// - productId (string)
// - productType ("regular" | "expensive" | etc)
// - onRated (optional callback) -> call after user submits rating successfully
const Rating = ({ productId, productType = "regular", onRated, value, onChange }) => {
  const [myRating, setMyRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const fetchRating = useCallback(async () => {
    if (!productId) return;

    try {
      const token = sessionStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await axiosInstance.get(
        `/ratings/${productId}/${productType}`,
        config
      );

      setAverageRating(res.data?.averageRating || 0);
      setTotalRatings(res.data?.totalRatings || 0);

      // Set user's existing rating if returned by API
      if (res.data?.userRating) {
        setMyRating(res.data.userRating);
      }
    } catch (err) {
      console.error("Error fetching rating:", err);
    }
  }, [productId, productType]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fixed: MUI Rating onChange now properly receives the value
  const handleRatingChange = async (event, newValue) => {
    if (!newValue) return;

    if (onChange) {
      onChange(event, newValue);
    }

    const userEmail = sessionStorage.getItem("email");
    const token = sessionStorage.getItem("token");

    if (!userEmail || !token) {
      showSnackbar("Please login to rate this product", "warning");
      return;
    }

    try {
      setLoading(true);

      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axiosInstance.post(
        `/ratings`,
        {
          productId,
          productType,
          rating: newValue,
        },
        config
      );

      setMyRating(newValue);
      showSnackbar("Thank you for your rating!", "success");

      // refresh average immediately
      await fetchRating();

      // notify parent so product card can refresh too (instant update)
      onRated?.(productId);
    } catch (err) {
      console.error("Error submitting rating:", err);
      showSnackbar(err.response?.data?.message || "Failed to submit rating. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <MuiRating
          value={value !== undefined ? Number(value) : (Number(myRating) || Number(averageRating))}
          onChange={handleRatingChange}
          precision={1}
          disabled={loading}
          size="medium"
        />
        <Typography variant="body2" color="text.secondary">
          {averageRating ? averageRating.toFixed(1) : "0.0"} ({totalRatings})
        </Typography>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Rating;
