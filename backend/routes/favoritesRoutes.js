import express from "express";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  clearFavorites,
} from "../controllers/favoritesController.js";

import { protect, userOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/:email", protect, userOnly, getFavorites);
router.post("/add", protect, userOnly, addFavorite);
router.delete("/remove", protect, userOnly, removeFavorite);
router.delete("/clear/:email", protect, userOnly, clearFavorites);

export default router;
