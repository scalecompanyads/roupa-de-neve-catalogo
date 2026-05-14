"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { initialCatalogData } from "@/lib/catalog-data";
import { hasSupabaseConfig, storageBucket, supabase } from "@/lib/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { CatalogData, Category, Product } from "@/lib/types";

const localKey = "nevou-catalog-admin";
const colorPresets = [
  { hex: "#111111", name: "Preto" },
  { hex: "#ffffff", name: "Branco" },
  { hex: "#f4f0e8", name: "Off-white" },
  { hex: "#8b1e3f", name: "Vinho" },
  { hex: "#c8102e", name: "Vermelho" },
  { hex: "#f4a8bc", name: "Rosa" },
  { hex: "#c7aa83", name: "Bege" },
  { hex: "#5a3727", name: "Marrom" },
  { hex: "#9aa0a6", name: "Cinza" },
  { hex: "#15285f", name: "Azul-marinho" },
  { hex: "#0d6b43", name: "Verde" },
  { hex: "#c9a84c", name: "Dourado" }
];

const namedColorHex: Record<string, string> = {
  preto: "#111111",
  branca: "#ffffff",
  branco: "#ffffff",
  "off-white": "#f4f0e8",
  vinho: "#8b1e3f",
  vermelho: "#c8102e",
  rosa: "#f4a8bc",
  "rosa claro": "#f7c8d5",
  bege: "#c7aa83",
  marrom: "#5a3727",
  cinza: "#9aa0a6",
  prata: "#9aa0a6",
  "azul-marinho": "#15285f",
  verde: "#0d6b43",
  dourado: "#c9a84c"
};

function splitColorTag(color: string) {
  const [rawHex, ...nameParts] = color.split("|");
  const name = nameParts.join("|").trim();
  if (name) return { hex: rawHex.trim(), name };

  const trimmed = color.trim();
  const lower = trimmed.toLowerCase();
  return {
    hex: /^#([0-9a-f]{6})$/i.test(trimmed) ? trimmed : namedColorHex[lower] || "#111111",
    name: /^#([0-9a-f]{6})$/i.test(trimmed) ? "Nova cor" : trimmed
  };
}

function makeColorTag(hex: string, name: string) {
  return `${hex}|${name.trim() || "Nova cor"}`;
}

function normalizeCatalog(data: CatalogData): CatalogData {
  return {
    categories: data.categories,
    products: data.products.map((product) => ({
      ...product,
      subtitle: "",
      price: "",
      clpPrice: "",
      images: product.images.slice(0, 2)
    }))
  };
}

function blankProduct(categoryId: string, order: number): Product {
  return {
    id: crypto.randomUUID(),
    categoryId,
    name: "Novo produto",
    subtitle: "",
    price: "",
    order,
    active: true,
    colors: [makeColorTag("#111111", "Preto")],
    images: []
  };
}

async function saveSupabaseData(data: CatalogData) {
  if (!supabase) return;

  await supabase.from("categories").upsert(data.categories.map((category) => ({
    id: category.id,
    name: category.name,
    tagline: category.tagline,
    tone: category.tone,
    order_index: category.order
  })));

  await supabase.from("products").upsert(data.products.map((product) => ({
    id: product.id,
    category_id: product.categoryId,
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    clp_price: product.clpPrice || "",
    order_index: product.order,
    active: product.active,
    colors: product.colors
  })));

  const images = data.products.flatMap((product) =>
    product.images.map((image, index) => ({
      id: image.id,
      product_id: product.id,
      url: image.url,
      alt: image.alt,
      color: image.color || "",
      is_cover: image.isCover || index === 0,
      order_index: index
    }))
  );
  if (images.length) await supabase.from("product_images").upsert(images);
}

export function AdminPanel() {
  const router = useRouter();
  const [data, setData] = useState<CatalogData>(initialCatalogData);
  const [selectedId, setSelectedId] = useState(initialCatalogData.products[0]?.id || "");
  const [draftColorNames, setDraftColorNames] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(hasSupabaseConfig ? "Conectando ao Supabase..." : "Modo local: pronto para conectar ao Supabase.");

  const handleLogout = async () => {
    const client = createSupabaseBrowserClient();
    await client.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  useEffect(() => {
    const load = async () => {
      const saved = window.localStorage.getItem(localKey);

      try {
        const response = await fetch("/api/catalog", { cache: "no-store" });
        const remote = response.ok ? await response.json() as CatalogData : null;
        if (remote) {
          setData(normalizeCatalog(remote));
          setSelectedId(remote.products[0]?.id || "");
          setStatus(hasSupabaseConfig ? "Dados carregados do Supabase." : "Dados carregados do rascunho local.");
          return;
        }
      } catch {
        setStatus("Não consegui carregar o rascunho salvo. Usando dados do navegador.");
      }

      if (saved) setData(normalizeCatalog(JSON.parse(saved)));
    };
    load();
  }, []);

  const selected = useMemo(() => data.products.find((product) => product.id === selectedId), [data, selectedId]);
  const orderedCategories = useMemo(() => [...data.categories].sort((a, b) => a.order - b.order), [data.categories]);

  useEffect(() => {
    if (!selected) return;
    setDraftColorNames(Object.fromEntries(selected.colors.map((color, index) => [`${selected.id}-${index}`, splitColorTag(color).name])));
  }, [selectedId]);

  const persist = (next: CatalogData) => {
    const normalized = normalizeCatalog(next);
    setData(normalized);
    window.localStorage.setItem(localKey, JSON.stringify(normalized));
    setIsDirty(true);
    setStatus("Alterações pendentes. Clique em Salvar alterações para atualizar o catálogo.");
  };

  const saveChanges = async () => {
    const normalized = normalizeCatalog(data);
    setIsSaving(true);
    if (hasSupabaseConfig) {
      await saveSupabaseData(normalized);
      setStatus("Alterações salvas no Supabase.");
    } else {
      try {
        await fetch("/api/catalog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalized)
        });
        setStatus("Alterações salvas. Recarregue o catálogo público para ver a atualização.");
      } catch {
        setStatus("Alterações salvas neste navegador, mas não consegui salvar o rascunho público.");
      }
    }
    setIsDirty(false);
    setIsSaving(false);
  };

  const updateProduct = (patch: Partial<Product>) => {
    const next = {
      ...data,
      products: data.products.map((product) => product.id === selectedId ? { ...product, ...patch } : product)
    };
    persist(next);
  };

  const updateColor = (index: number, value: string) => {
    if (!selected) return;
    const oldColor = selected.colors[index];
    updateProduct({
      colors: selected.colors.map((color, colorIndex) => colorIndex === index ? value : color),
      images: selected.images.map((image) => image.color === oldColor ? { ...image, color: value } : image)
    });
  };

  const updateColorHex = (index: number, hex: string) => {
    if (!selected) return;
    const oldColor = selected.colors[index];
    const current = splitColorTag(oldColor);
    const nextColor = makeColorTag(hex, current.name);
    updateColor(index, nextColor);
  };

  const updateColorName = (index: number, name: string) => {
    if (!selected) return;
    const oldColor = selected.colors[index];
    const current = splitColorTag(oldColor);
    const nextColor = makeColorTag(current.hex, name);
    updateColor(index, nextColor);
  };

  const commitColorName = (index: number) => {
    if (!selected) return;
    const key = `${selected.id}-${index}`;
    const draft = draftColorNames[key];
    if (typeof draft === "string") updateColorName(index, draft);
  };

  const addColor = (value = makeColorTag("#111111", "Preto")) => {
    if (!selected) return;
    updateProduct({ colors: [...selected.colors, value] });
  };

  const removeColor = (index: number) => {
    if (!selected) return;
    const removed = selected.colors[index];
    updateProduct({
      colors: selected.colors.filter((_, colorIndex) => colorIndex !== index),
      images: selected.images.map((image) => image.color === removed ? { ...image, color: "" } : image)
    });
  };

  const pickColor = async (index?: number) => {
    if (!("EyeDropper" in window)) {
      window.alert("O conta-gotas não está disponível neste navegador. Use o seletor de cor.");
      return;
    }

    const eyeDropper = new (window as typeof window & { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper();
    const result = await eyeDropper.open();
    if (typeof index === "number") updateColorHex(index, result.sRGBHex);
    else addColor(makeColorTag(result.sRGBHex, "Nova cor"));
  };

  const addCategory = () => {
    const name = window.prompt("Nome da categoria");
    if (!name) return;
    const category: Category = {
      id: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
      name,
      tagline: "Nova categoria",
      tone: "blue",
      order: data.categories.length + 1
    };
    persist({ ...data, categories: [...data.categories, category] });
  };

  const addProduct = () => {
    const categoryId = data.categories[0]?.id;
    if (!categoryId) return;
    const nextProduct = blankProduct(categoryId, data.products.length + 1);
    setSelectedId(nextProduct.id);
    persist({ ...data, products: [...data.products, nextProduct] });
  };

  const addImage = async (file: File) => {
    if (!selected) return;
    if (selected.images.length >= 2) {
      window.alert("Cada produto usa no máximo 2 fotos no carrossel. Remova uma foto antes de adicionar outra.");
      return;
    }
    let url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });
    if (supabase) {
      const path = `${selected.id}/${Date.now()}-${file.name}`;
      const uploaded = await supabase.storage.from(storageBucket).upload(path, file, { upsert: true });
      if (!uploaded.error) {
        const publicUrl = supabase.storage.from(storageBucket).getPublicUrl(path);
        url = publicUrl.data.publicUrl;
      }
    }
    updateProduct({
      images: [...selected.images, { id: crypto.randomUUID(), url, alt: selected.name, color: selected.colors[0] || "", isCover: selected.images.length === 0 }]
    });
  };

  const removeImage = async (imageId: string) => {
    if (!selected) return;
    if (supabase) await supabase.from("product_images").delete().eq("id", imageId);
    updateProduct({ images: selected.images.filter((item) => item.id !== imageId) });
  };

  const updateImageColor = (imageId: string, color: string) => {
    if (!selected) return;
    const nextColors = color && !selected.colors.includes(color) ? [...selected.colors, color] : selected.colors;
    updateProduct({
      colors: nextColors,
      images: selected.images.map((image) => image.id === imageId ? { ...image, color } : image)
    });
  };

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p>Painel Nevou no Chile</p>
          <h1>Editar catálogo</h1>
        </div>
        <div className="admin-actions">
          <button type="button" disabled={!isDirty || isSaving} onClick={saveChanges}>{isSaving ? "Salvando..." : "Salvar alterações"}</button>
          <a href="/" target="_blank">Ver catálogo</a>
          <button type="button" className="logout-btn" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div className="admin-status">{status}</div>

      <section className="admin-layout">
        <aside className="admin-sidebar">
          <button onClick={addCategory}>Adicionar categoria</button>
          <button onClick={addProduct}>Adicionar produto</button>
          {orderedCategories.map((category) => {
            const products = data.products
              .filter((product) => product.categoryId === category.id)
              .sort((a, b) => a.order - b.order);

            if (!products.length) return null;

            return (
              <div className="sidebar-category" key={category.id}>
                <h2>{category.name}</h2>
                {products.map((product) => (
                  <button className={product.id === selectedId ? "selected" : ""} key={product.id} onClick={() => setSelectedId(product.id)}>
                    <span>{product.name}</span>
                    <small>{product.active ? "Ativo" : "Oculto"}</small>
                  </button>
                ))}
              </div>
            );
          })}
        </aside>

        {selected ? (
          <form className="editor" onSubmit={(event) => event.preventDefault()}>
            <label>Nome do produto<input value={selected.name} onChange={(event) => updateProduct({ name: event.target.value })} /></label>
            <label>Categoria
              <select value={selected.categoryId} onChange={(event) => updateProduct({ categoryId: event.target.value })}>
                {data.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </label>
            <label className="check-row"><input type="checkbox" checked={selected.active} onChange={(event) => updateProduct({ active: event.target.checked })} /> Produto ativo</label>

            <div className="color-editor">
              <div className="editor-title">
                <strong>Cores disponíveis</strong>
                <div>
                  <button type="button" onClick={() => addColor()}>Adicionar cor</button>
                  <button type="button" className="icon-button" title="Usar conta-gotas" aria-label="Usar conta-gotas" onClick={() => pickColor()}>
                    <span aria-hidden="true">◎</span>
                  </button>
                </div>
              </div>

              <div className="color-presets">
                {colorPresets.map((color) => (
                  <button
                    type="button"
                    key={color.name}
                    style={{ background: color.hex }}
                    title={color.name}
                    onClick={() => addColor(makeColorTag(color.hex, color.name))}
                  />
                ))}
              </div>

              <div className="color-list">
                {selected.colors.map((color, index) => (
                  <div className="color-row" key={`${color}-${index}`}>
                    <input type="color" value={splitColorTag(color).hex} onChange={(event) => updateColorHex(index, event.target.value)} />
                    <input
                      value={draftColorNames[`${selected.id}-${index}`] ?? splitColorTag(color).name}
                      onBlur={() => commitColorName(index)}
                      onChange={(event) => setDraftColorNames((current) => ({ ...current, [`${selected.id}-${index}`]: event.target.value }))}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitColorName(index);
                          event.currentTarget.blur();
                        }
                      }}
                      placeholder="Nome da cor"
                    />
                    <button type="button" className="icon-button" title="Usar conta-gotas" aria-label="Usar conta-gotas" onClick={() => pickColor(index)}>
                      <span aria-hidden="true">◎</span>
                    </button>
                    <button type="button" onClick={() => removeColor(index)}>Remover</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="image-editor">
              <div>
                <strong>Fotos do carrossel</strong>
                <p>Use 2 fotos por produto. A primeira aparece como abertura do carrossel.</p>
                <input type="file" accept="image/*" disabled={selected.images.length >= 2} onChange={(event) => event.target.files?.[0] && addImage(event.target.files[0])} />
              </div>
              <div className="admin-images">
                {selected.images.map((image) => (
                  <figure key={image.id}>
                    <img src={image.url} alt={image.alt} />
                    <label className="image-color-field">
                      Cor desta foto
                      <select value={image.color || ""} onChange={(event) => updateImageColor(image.id, event.target.value)}>
                        <option value="">Sem cor</option>
                        {selected.colors.map((color) => <option key={color} value={color}>{splitColorTag(color).name}</option>)}
                      </select>
                    </label>
                    <button type="button" onClick={() => removeImage(image.id)}>Remover</button>
                    <button type="button" onClick={() => updateProduct({ images: selected.images.map((item) => ({ ...item, isCover: item.id === image.id })) })}>Capa</button>
                  </figure>
                ))}
              </div>
            </div>
          </form>
        ) : null}
      </section>
    </main>
  );
}
