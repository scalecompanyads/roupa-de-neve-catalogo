import { initialCatalogData } from "./catalog-data";
import { readLocalCatalogData } from "./local-catalog";
import { hasSupabaseConfig, supabase } from "./supabase";
import type { CatalogData, Category, Product } from "./types";

export async function getCatalogData(options: { includeInactive?: boolean } = {}): Promise<CatalogData> {
  if (!hasSupabaseConfig || !supabase) {
    return await readLocalCatalogData() || initialCatalogData;
  }

  const [categoriesResult, productsResult, imagesResult] = await Promise.all([
    supabase.from("categories").select("*").order("order_index"),
    (options.includeInactive
      ? supabase.from("products").select("*").order("order_index")
      : supabase.from("products").select("*").eq("active", true).order("order_index")),
    supabase.from("product_images").select("*").order("order_index")
  ]);

  if (categoriesResult.error || productsResult.error || imagesResult.error) {
    return initialCatalogData;
  }

  if (!categoriesResult.data?.length || !productsResult.data?.length) {
    return initialCatalogData;
  }

  const categories: Category[] = categoriesResult.data.map((row) => ({
    id: row.id,
    name: row.name,
    tagline: row.tagline || "",
    tone: row.tone || "blue",
    order: row.order_index || 0
  }));

  const products: Product[] = productsResult.data.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    subtitle: row.subtitle || "",
    price: row.price || "",
    clpPrice: row.clp_price || "",
    order: row.order_index || 0,
    active: row.active ?? true,
    colors: row.colors || [],
    images: (imagesResult.data || [])
      .filter((image) => image.product_id === row.id)
      .map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.alt || row.name,
        color: image.color || "",
        isCover: image.is_cover
      }))
  }));

  return { categories, products };
}
