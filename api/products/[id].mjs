import { readFileSync } from "node:fs";
import { join } from "node:path";

const products = JSON.parse(readFileSync(join(process.cwd(), "server/data/products.json"), "utf8"));

export default function handler(req, res) {
  res.setHeader("X-MongoDB", "not-connected");
  res.setHeader("X-Data-Source", "project-file");
  const product = products.find((item) => String(item.id) === String(req.query.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.status(200).json(product);
}
