import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import cartRoute from "./routes/cart.js";
import cors from "cors";
dotenv.config();
console.log(process.env.MONGO_URL)

const app = express();

app.use(express.json());

// DB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Routes

app.use(cors({
  origin: "http://localhost:3000", // React dev server
  credentials: true,
}));
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port " + (process.env.PORT || 5000));
});
