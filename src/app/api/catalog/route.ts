import { NextResponse } from "next/server";
import { getCatalogData } from "@/lib/catalog-service";
import { hasSupabaseConfig } from "@/lib/supabase";
import { writeLocalCatalogData } from "@/lib/local-catalog";
import type { CatalogData } from "@/lib/types";

export async function GET() {
  const data = await getCatalogData({ includeInactive: true });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const data = await request.json() as CatalogData;

  if (!hasSupabaseConfig) {
    await writeLocalCatalogData(data);
  }

  return NextResponse.json({ ok: true });
}
