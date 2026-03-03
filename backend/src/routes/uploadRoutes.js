import express from "express";
import multer from "multer";
import path from "path";
import { authRequired, requireRole } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const unique = `${safeBase}-${Date.now()}${ext}`;
    cb(null, unique);
  },
});

function fileFilter(req, file, cb) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only JPEG, PNG, WEBP images are allowed"));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.post(
  "/",
  authRequired,
  requireRole("seller"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
      const base = `${req.protocol}://${req.get("host")}`;
      const pathUrl = `/uploads/${req.file.filename}`;
      const url = `${base}${pathUrl}`;
      res.status(201).json({ url, path: pathUrl, filename: req.file.filename });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to upload image" });
    }
  }
);

export default router;
