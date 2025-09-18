import express from "express";
import {
  getAllProduct,
  getHomepageData,
  getProductById,
} from "../controllers/productController.js";

const productRouter = express.Router();
productRouter.get("/", getAllProduct);
productRouter.get("/homepage", getHomepageData);
productRouter.get("/:id", getProductById);

export default productRouter;
