import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: String,
    alt: String,
    price: { type: Number, required: true },
    oldPrice: Number,
    discount: String,
    section: { type: String, enum: ["flash", "featured"], default: "featured" },
    hidden: Boolean,
    stars: Number,
    halfStar: Boolean,
    reviewCount: Number,
  },
  { versionKey: false },
);

export const Product = mongoose.model("Product", productSchema);
