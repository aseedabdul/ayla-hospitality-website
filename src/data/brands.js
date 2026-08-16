import { products } from "./products";

// Derived + curated brand list — centralized so filters and admin forms share one source.
export const brands = [...new Set(products.map((p) => p.brand))].sort();
