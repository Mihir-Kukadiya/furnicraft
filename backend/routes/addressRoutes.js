import express from "express";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

import { protect, userOnly } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.get("/:email", protect, userOnly, getAddresses);
router.post("/", protect, userOnly, addAddress);
router.put("/:id", protect, userOnly, updateAddress);
router.delete("/:id", protect, userOnly, deleteAddress);

export default router;
