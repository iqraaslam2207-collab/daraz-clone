import { readFileSync } from "node:fs";
import { join } from "node:path";

const products = JSON.parse(readFileSync(join(process.cwd(), "server/data/products.json"), "utf8"));

function filterProducts(query) {
  let list = products.slice();
  if (query.section) list = list.filter((item) => item.section === query.section);
  if (query.search) {
    const needle = String(query.search).toLowerCase();
    list = list.filter((item) => item.title.toLowerCase().includes(needle));
  }
  return list;
}

export default function handler(req, res) {
  res.setHeader("X-MongoDB", "not-connected");
  res.setHeader("X-Data-Source", "project-file");
  if (req.method === "POST") {
    res.status(503).json({
      ok: false,
      mongodbLive: false,
      error: "Vercel cannot save into the MongoDB on your laptop.",
    });
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  res.status(200).json(filterProducts(req.query || {}));
}
