import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Rating as MuiRating } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

// Props:
// - productId (string)
// - productType ("regular" | "expensive" | etc)
// - onRated (optional callback) -> call after user submits rating successfully
const Rating = ({ productId, productType = "regular", onRated }) => {
  const [myRating, setMyRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);

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

      // if your API returns user's rating too, set it here (optional)
      // setMyRating(res.data?.userRating || 0);
    } catch (err) {
      console.error("Error fetching rating:", err);
    }
  }, [productId, productType]);

  useEffect(() => {
    fetchRating();
  }, [fetchRating]);

  const handleChange = async (_, value) => {
    if (!value) return;

    const userEmail = sessionStorage.getItem("email");
    if (!userEmail) return; // you can show snackbar if you want

    try {
      setLoading(true);

      const token = sessionStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      // ⚠️ Adjust endpoint/body according to your backend
      await axiosInstance.post(
        `/ratings`,
        {
          productId,
          productType,
          rating: value,
        },
        config
      );

      setMyRating(value);

      // refresh avg immediately in dialog
      await fetchRating();

      // ✅ notify parent so product card can refresh too (instant update)
      onRated?.(productId);
    } catch (err) {
      console.error("Error submitting rating:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <MuiRating
          value={myRating || averageRating}
          onChange={handleChange}
          precision={1}
          disabled={loading}
        />
        <Typography variant="body2" color="text.secondary">
          {averageRating ? averageRating.toFixed(1) : "0.0"} ({totalRatings})
        </Typography>
      </Box>
    </Box>
  );
};

export default Rating;