import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mysql.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userModel from "./models/userModel.js";
import productModel from "./models/productModel.js";
import cartModel from "./models/cartModel.js";
import cartRouter from "./routes/cartRoute.js";
import orderModel from "./models/orderModel.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// kết nối db
connectDB.connect((err) => {
  if (err) {
    console.error("Can not connect to database: ", err.stack);
    return;
  }
  console.log("DB connected.");
});

connectCloudinary();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.1.9:8081",
      "https://c-mart-shop-fe.vercel.app",
      "https://fe-mart-4e3l.vercel.app",
    ],
    credentials: true,
  })
);

// api endpoints
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/cart", cartRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log("Server started on PORT: " + port);
});
