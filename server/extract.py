import html
import json
import re
from pathlib import Path

text = Path(r"D:\daraz-clone\daraz.html").read_text(encoding="utf-8")
articles = re.findall(
    r'<article class="([^"]+)" data-product>(.*?)</article>',
    text,
    re.S,
)
out = []
for index, (cls, body) in enumerate(articles, 1):
    img = re.search(r'<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"', body)
    if img:
        src, alt = img.group(1), img.group(2)
    else:
        img = re.search(r'<img[^>]+alt="([^"]*)"[^>]*src="([^"]+)"', body)
        src, alt = (img.group(2), img.group(1)) if img else ("", "")
    title_match = re.search(r'class="product-title"[^>]*>(.*?)</p>', body, re.S)
    if not title_match:
        title_match = re.search(
            r'<div class="product-info">\s*<p>(.*?)</p>', body, re.S
        )
    raw_title = title_match.group(1) if title_match else alt
    title = html.unescape(re.sub(r"<[^>]+>", "", raw_title)).strip()
    prices = [int(p.replace(",", "")) for p in re.findall(r"Rs\.?\s*([\d,]+)", body)]
    discount = re.search(r"(-?\d+%)", body)
    reviews = re.search(r"\((\d+)\)", body)
    out.append(
        {
            "id": str(index),
            "title": title,
            "image": src,
            "alt": html.unescape(alt),
            "price": prices[0] if prices else 0,
            "oldPrice": prices[1] if len(prices) > 1 else None,
            "discount": discount.group(1) if discount else "",
            "section": "flash" if "product-card" in cls else "featured",
            "hidden": "load-more-hidden" in cls,
            "stars": body.count("fa-solid fa-star"),
            "halfStar": "fa-star-half" in body,
            "reviewCount": int(reviews.group(1)) if reviews else 0,
        }
    )

dest = Path(r"D:\daraz-clone\server\data\products.json")
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text(json.dumps(out, indent=2), encoding="utf-8")
print(len(out))
