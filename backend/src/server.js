import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Ecommerce API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/uploads", uploadRoutes);

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce_app";

async function start() {
  await connectDB(MONGO_URI);
  const port = Number(process.env.PORT) || 5000;
  const server = app.listen(port, () => {
    console.log(`✅ Server listening on http://localhost:${port}`);
  });
  server.on("error", (err) => {
    if (err && err.code === "EADDRINUSE") {
      const fallback = port + 1;
      console.warn(`⚠️ Port ${port} in use, switching to ${fallback}`);
      app.listen(fallback, () => {
        console.log(`✅ Server listening on http://localhost:${fallback}`);
      });
    } else {
      console.error("Server error", err);
      process.exit(1);
    }
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
