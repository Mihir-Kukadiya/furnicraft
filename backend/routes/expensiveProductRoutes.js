import express from "express";
import {
  getExpensiveProducts,
  createExpensiveProduct,
  deleteExpensiveProduct,
  updateExpensiveProduct,
} from "../controllers/expensiveProductController.js";

const router = express.Router();

router.get("/", getExpensiveProducts);
router.post("/", createExpensiveProduct);
router.put("/:id", updateExpensiveProduct);
router.delete("/:id", deleteExpensiveProduct);

export default router;
