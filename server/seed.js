import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Product } from "./models.js";

const dataFile = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "data",
  "products.json",
);

export async function seed() {
  if ((await Product.countDocuments()) > 0) return;
  const products = JSON.parse(await readFile(dataFile, "utf8"));
  await Product.insertMany(products);
  console.log("Products in MongoDB:", products.length);
}
