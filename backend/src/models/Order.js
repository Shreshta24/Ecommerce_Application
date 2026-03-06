import mongoose from "mongoose";

const deliveryAddressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceAtPurchase: { type: Number, required: true },
  },
  { _id: false }
);

const trackingUpdateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["ordered", "shipped", "out_for_delivery", "delivered", "cancelled"],
    },
    location: { type: String },
    note: { type: String },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "card" },
    deliveryAddress: deliveryAddressSchema,
    status: {
      type: String,
      enum: ["ordered", "shipped", "out_for_delivery", "delivered", "cancelled"],
      default: "ordered",
    },
    shippingTrackingNumber: { type: String },
    shippingCarrier: { type: String },
    currentLocation: { type: String },
    trackingUpdates: [trackingUpdateSchema],
    transportAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportAgent",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

