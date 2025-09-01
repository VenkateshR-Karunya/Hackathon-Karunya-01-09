// backend/routes/product.js
import express from "express";
import Product from "../models/product.js";
import { verifyAdmin } from "../middleware/auth.js"; // role-based check

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with search + filter
 * @query   search, category, minPrice, maxPrice, brand
 */
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, brand } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" }; // case-insensitive
    }
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   POST /api/products
 * @desc    Add new product (Admin only)
 */
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product (Admin only)
 */
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product (Admin only)
 */
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
