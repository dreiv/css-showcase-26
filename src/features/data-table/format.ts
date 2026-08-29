import type { Product } from "../../data/products";
import type { SortKey } from "./types";

export function formatCell(p: Product, key: SortKey): string {
  switch (key) {
    case "price":
      return `$${p.price.toFixed(2)}`;
    case "rating":
      return p.rating.toFixed(1);
    case "stock":
      return p.stock === 0 ? "Out of stock" : String(p.stock);
    default:
      return p[key] as string;
  }
}
