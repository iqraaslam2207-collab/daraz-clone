import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./db.js";
import { seed } from "./seed.js";
import { Product } from "./models.js";
import { registerUsers } from "./users.js";

const siteRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

function present(doc) {
  if (!doc) return doc;
  const item = { ...doc };
  delete item._id;
  return item;
}

function escapeReg(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

app.get("/api/products", async (req, res) => {
  const { search, section } = req.query;
  const filter = {};
  if (section) filter.section = section;
  if (search) filter.title = new RegExp(escapeReg(search), "i");
  const products = await Product.find(filter).lean();
  res.json(products.map(present));
});

app.get("/api/products/:id", async (req, res) => {
  const product = await Product.findOne({ id: req.params.id }).lean();
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(present(product));
});

app.post("/api/products", async (req, res) => {
  const { title, price, image, section } = req.body || {};
  if (!title || price == null) {
    return res.status(400).json({ error: "title and price are required" });
  }

  const product = await Product.create({
    id: Date.now().toString(),
    title,
    price: Number(price),
    image: image || "",
    alt: title,
    section: section || "featured",
    hidden: false,
    stars: 0,
    halfStar: false,
    reviewCount: 0,
    discount: "",
    oldPrice: null,
  });

  res.status(201).json(present(product.toObject()));
});

app.use(express.static(siteRoot));

registerUsers(app);

await connectDB('daraz_shop');
await seed();

app.listen(PORT, () => {
  console.log(`Daraz site: http://localhost:${PORT}/daraz.html`);
  console.log(`Products API: http://localhost:${PORT}/api/products`);
});
