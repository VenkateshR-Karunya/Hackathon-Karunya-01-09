import express from "express";
import Order from "../Models/Order.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// 🟢 Get all orders (Admin only)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🟢 Update order status (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // e.g. {status: "Shipped"}
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 🟢 Delete an order (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
