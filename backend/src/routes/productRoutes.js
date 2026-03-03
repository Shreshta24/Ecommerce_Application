import express from "express";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public list with filters for customer homepage
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page, limit, sortBy = "createdAt", order = "desc" } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const sortField = ["price", "createdAt", "name"].includes(sortBy) ? sortBy : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const hasPagination = page !== undefined || limit !== undefined;
    if (!hasPagination) {
      const items = await Product.find(filter)
        .populate("seller", "name email")
        .sort({ [sortField]: sortOrder });
      return res.json(items);
    }

    const pageNum = Math.max(1, Number(page || 1));
    const limitNum = Math.max(1, Math.min(50, Number(limit || 20)));
    const [items, total] = await Promise.all([
      Product.find(filter)
        .populate("seller", "name email")
        .sort({ [sortField]: sortOrder })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);
    res.json({ items, page: pageNum, total, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Seller: create product
router.post(
  "/",
  authRequired,
  requireRole("seller"),
  async (req, res) => {
    try {
      const { name, description, price, category, images, features, stock } =
        req.body;
      if (!name || !price || !category) {
        return res.status(400).json({ message: "Name, price, and category are required" });
      }
      const cat = await Category.findOne({ name: category, isActive: true });
      if (!cat) {
        return res.status(400).json({ message: "Invalid or inactive category" });
      }
      const product = await Product.create({
        name,
        description,
        price,
        category,
        images: images || [],
        features: features || [],
        stock: stock ?? 0,
        seller: req.user.id,
      });
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create product" });
    }
  }
);

// Seller: update own product
router.put(
  "/:id",
  authRequired,
  requireRole("seller"),
  async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.params.id,
        seller: req.user.id,
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const allowed = [
        "name",
        "description",
        "price",
        "category",
        "images",
        "features",
        "stock",
        "isActive",
      ];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          if (key === "category") {
            const cat = await Category.findOne({ name: req.body[key], isActive: true });
            if (!cat) {
              return res.status(400).json({ message: "Invalid or inactive category" });
            }
            product[key] = req.body[key];
          } else {
            product[key] = req.body[key];
          }
        }
      }
      await product.save();
      res.json(product);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update product" });
    }
  }
);

// Seller: list own products
router.get(
  "/mine",
  authRequired,
  requireRole("seller"),
  async (req, res) => {
    try {
      const products = await Product.find({ seller: req.user.id }).sort({
        createdAt: -1,
      });
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch seller products" });
    }
  }
);

export default router;
