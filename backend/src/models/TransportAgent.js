import mongoose from "mongoose";

const transportAgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TransportAgent = mongoose.model(
  "TransportAgent",
  transportAgentSchema
);

