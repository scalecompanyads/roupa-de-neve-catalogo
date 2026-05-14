import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { CatalogData } from "./types";

const catalogPath = path.join(process.cwd(), "data", "catalog.json");

export async function readLocalCatalogData(): Promise<CatalogData | null> {
  try {
    const content = await readFile(catalogPath, "utf8");
    return JSON.parse(content) as CatalogData;
  } catch {
    return null;
  }
}

export async function writeLocalCatalogData(data: CatalogData) {
  await mkdir(path.dirname(catalogPath), { recursive: true });
  await writeFile(catalogPath, JSON.stringify(data, null, 2), "utf8");
}
