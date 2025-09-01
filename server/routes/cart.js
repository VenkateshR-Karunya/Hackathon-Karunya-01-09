import express from "express";
import Cart from "../models/cart.js";
import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

// Get user cart
router.get("/", verifyUser, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart || { items: [] });
});

// Add to cart
router.post("/add", verifyUser, async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

// Remove from cart
router.post("/remove", verifyUser, async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });

  cart.items = cart.items.filter(item => item.product.toString() !== productId);

  await cart.save();
  res.json(cart);
});

export default router;
