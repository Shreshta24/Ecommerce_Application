import express from "express";
import { authRequired, requireRole } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { TransportAgent } from "../models/TransportAgent.js";
import { Category } from "../models/Category.js";

const router = express.Router();

router.use(authRequired, requireRole("admin"));

// Manage sellers (list pending/approved)
router.get("/sellers", async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select("-passwordHash");
    res.json(sellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
});

// Transport agents CRUD (simple)
router.get("/transport-agents", async (req, res) => {
  try {
    const agents = await TransportAgent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transport agents" });
  }
});

router.post("/transport-agents", async (req, res) => {
  try {
    const agent = await TransportAgent.create(req.body);
    res.status(201).json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create transport agent" });
  }
});

router.put("/transport-agents/:id", async (req, res) => {
  try {
    const agent = await TransportAgent.findById(req.params.id);
    if (!agent) return res.status(404).json({ message: "Transport agent not found" });
    const allowed = ["name", "phone", "company", "isActive"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) agent[key] = req.body[key];
    }
    await agent.save();
    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update transport agent" });
  }
});

router.delete("/transport-agents/:id", async (req, res) => {
  try {
    const agent = await TransportAgent.findByIdAndDelete(req.params.id);
    if (!agent) return res.status(404).json({ message: "Transport agent not found" });
    res.json({ message: "Transport agent removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove transport agent" });
  }
});

// Categories CRUD
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, isActive } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name: name.trim(), isActive });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (name !== undefined) category.name = name.trim();
    if (isActive !== undefined) category.isActive = !!isActive;
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update category" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

// Assign transport agent and update shipping details for an order
router.put("/orders/:id/shipping", async (req, res) => {
  try {
    const {
      status,
      shippingTrackingNumber,
      shippingCarrier,
      transportAgentId,
      currentLocation,
      note,
    } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) order.status = status;
    if (shippingTrackingNumber) order.shippingTrackingNumber = shippingTrackingNumber;
    if (shippingCarrier) order.shippingCarrier = shippingCarrier;
    if (transportAgentId) order.transportAgent = transportAgentId;
    if (currentLocation) order.currentLocation = currentLocation;

    if (status || currentLocation || note) {
      order.trackingUpdates = order.trackingUpdates || [];
      order.trackingUpdates.push({
        status: status || undefined,
        location: currentLocation || undefined,
        note: note || undefined,
        at: new Date(),
      });
    }

    await order.save();
    const populated = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product")
      .populate("transportAgent");
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update shipping details" });
  }
});

// Admin: order details
router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product")
      .populate("transportAgent");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

// Admin: list all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.product")
      .populate("transportAgent");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
