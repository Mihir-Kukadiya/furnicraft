import express from "express";
import {
  getFavorites,
  toggleFavorite,
  removeFavorite,
  clearFavorites,
} from "../controllers/favoritesController.js";

const router = express.Router();

router.get("/:email", getFavorites);
router.post("/toggle", toggleFavorite);
router.delete("/remove", removeFavorite);
router.delete("/clear/:email", clearFavorites);

export default router;
