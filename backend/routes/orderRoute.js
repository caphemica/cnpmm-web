import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  createOrder,
  getMyOrders,
  requestCancelOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", authenticateToken, getMyOrders);
orderRouter.post("/", authenticateToken, createOrder);
orderRouter.patch("/:id/status", updateOrderStatus);

export default orderRouter;

// Yêu cầu hủy
orderRouter.patch("/:id/cancel-request", authenticateToken, requestCancelOrder);
