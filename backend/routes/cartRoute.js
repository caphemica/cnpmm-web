import express from "express";
import authenticateToken from "../middleware/auth.js";
import { addToCart, getMyCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.get("/", authenticateToken, getMyCart);
cartRouter.post("/add", authenticateToken, addToCart);

export default cartRouter;
