import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";

const router = express.Router();

// Customer: create order (simulate payment)
router.post("/", authRequired, requireRole("customer"), async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== items.length) {
      return res.status(400).json({ message: "Some products are unavailable" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find(
        (p) => p._id.toString() === item.productId
      );
      if (!product) continue;

      const quantity = item.quantity || 1;
      const priceAtPurchase = product.price;
      totalAmount += priceAtPurchase * quantity;
      orderItems.push({
        product: product._id,
        quantity,
        priceAtPurchase,
      });
    }

    // Simulate payment always successful
    const order = await Order.create({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      paymentStatus: "paid",
      paymentMethod: paymentMethod || "card",
      deliveryAddress,
      status: "ordered",
      trackingUpdates: [
        {
          status: "ordered",
          location: "Order placed",
        },
      ],
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

// Customer: list own orders
router.get("/mine", authRequired, requireRole("customer"), async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.product")
      .populate("transportAgent")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Seller: list orders that include seller's products
router.get("/seller", authRequired, requireRole("seller"), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.product")
      .populate("transportAgent")
      .sort({ createdAt: -1 });

    const mine = [];
    for (const o of orders) {
      const sellerItems = (o.items || []).filter(
        (it) => it.product?.seller?.toString?.() === req.user.id
      );
      if (sellerItems.length === 0) continue;
      mine.push({
        ...o.toObject(),
        items: sellerItems,
      });
    }
    res.json(mine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch seller orders" });
  }
});

export default router;

