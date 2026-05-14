const fs = require('fs');
const { createClient } = require("@supabase/supabase-js");

const envVars = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if (key && val) acc[key.trim()] = val.trim();
  return acc;
}, {});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

const img = (url, alt, color, isCover = false) => ({
  id: url,
  url,
  alt,
  color,
  isCover
});

const product = (
  id,
  categoryId,
  name,
  subtitle,
  price,
  order,
  images,
  colors
) => ({
  id,
  categoryId,
  name,
  subtitle,
  price,
  order,
  active: true,
  images,
  colors
});

const initialCatalogData = {
  categories: [
    { id: "macacoes", name: "Macacões", tagline: "Impermeáveis · Térmicos · Alta Performance", tone: "red", order: 1 },
    { id: "casacos", name: "Casacos e Capas", tagline: "Estilo · Conforto · Proteção", tone: "blue", order: 2 },
    { id: "conjuntos", name: "Conjuntos", tagline: "Looks Completos · Estilo Total", tone: "red", order: 3 },
    { id: "botas", name: "Botas e Acessórios", tagline: "Conforto · Segurança · Estilo", tone: "dark", order: 4 }
  ],
  products: [
    product("macacao-01", "macacoes", "Macacão 01", "", "", 1, [
      img("/catalogo/macacoes/items/1/IMG_5038.JPG", "Macacão 01", "Preto", true),
      img("/catalogo/macacoes/items/1/IMG_5039.JPG", "Macacão 01 detalhe", "Marrom"),
      img("/catalogo/macacoes/items/1/IMG_5040.JPG", "Macacão 01 variação", "Branco")
    ], ["#111111|Preto", "#5a3727|Marrom"]),
    product("macacao-02", "macacoes", "Macacão 02", "", "", 2, [
      img("/catalogo/macacoes/items/2/IMG_5052.JPG", "Macacão 02", "Cinza", true),
      img("/catalogo/macacoes/items/2/IMG_5053.JPG", "Macacão 02 detalhe", "Preto"),
      img("/catalogo/macacoes/items/2/IMG_5054.JPG", "Macacão 02 variação", "Preto")
    ], ["#9aa0a6|Cinza", "#111111|Preto"]),
    product("macacao-03", "macacoes", "Macacão 03", "", "", 3, [
      img("/catalogo/macacoes/items/3/IMG_5057.JPG", "Macacão 03", "Rosa", true),
      img("/catalogo/macacoes/items/3/IMG_5058.JPG", "Macacão 03 detalhe", "Bege"),
      img("/catalogo/macacoes/items/3/IMG_5059.JPG", "Macacão 03 variação", "Preto")
    ], ["#f4a8bc|Rosa", "#c7aa83|Bege"]),
    product("macacao-04", "macacoes", "Macacão 04", "", "", 4, [
      img("/catalogo/macacoes/items/4/IMG_5074.JPG", "Macacão 04", "Preto", true),
      img("/catalogo/macacoes/items/4/IMG_5090.JPG", "Macacão 04 detalhe", "Cinza"),
      img("/catalogo/macacoes/items/4/IMG_5091.JPG", "Macacão 04 variação", "Branco")
    ], ["#111111|Preto", "#9aa0a6|Cinza"]),
    product("macacao-05", "macacoes", "Macacão 05", "", "", 5, [
      img("/catalogo/macacoes/items/5/25e1339b-7609-4ed9-80b2-e219339da99f.JPG", "Macacão 05", "Marrom", true)
    ], ["#5a3727|Marrom", "#f4f0e8|Off-white"]),
    product("macacao-06", "macacoes", "Macacão 06", "", "", 6, [
      img("/catalogo/macacoes/items/6/32b07301-c078-414d-b776-dd77db876096.JPG", "Macacão 06", "Rosa claro", true)
    ], ["#f7c8d5|Rosa claro"]),
    product("macacao-07", "macacoes", "Macacão 07", "", "", 7, [
      img("/catalogo/macacoes/items/7/d62ec155-7d26-465d-9df6-2d2b7a50d4e0.JPG", "Macacão 07", "Off-white", true)
    ], ["#f4f0e8|Off-white", "#111111|Preto", "#c7aa83|Bege"]),
    product("casaco-01", "casacos", "Casaco 01", "", "", 1, [
      img("/catalogo/casacos/items/1/IMG_5030.JPG", "Casaco 01", "Verde", true),
      img("/catalogo/casacos/items/1/IMG_5031.JPG", "Casaco 01 detalhe", "Vermelho")
    ], ["#0d6b43|Verde", "#c8102e|Vermelho"]),
    product("casaco-02", "casacos", "Casaco 02", "", "", 2, [
      img("/catalogo/casacos/items/2/IMG_5032.JPG", "Casaco 02", "Vinho", true),
      img("/catalogo/casacos/items/2/IMG_5033.JPG", "Casaco 02 detalhe", "Preto"),
      img("/catalogo/casacos/items/2/IMG_5034.JPG", "Casaco 02 variação", "Bege")
    ], ["#8b1e3f|Vinho", "#111111|Preto"]),
    product("casaco-03", "casacos", "Casaco 03", "", "", 3, [
      img("/catalogo/casacos/items/3/IMG_5071.JPG", "Casaco 03", "Prata", true)
    ], ["#9aa0a6|Prata", "#8b1e3f|Vinho", "#111111|Preto", "#8a7e6d|Animal print"]),
    product("casaco-04", "casacos", "Casaco 04", "", "", 4, [
      img("/catalogo/casacos/items/4/IMG_5080.JPG", "Casaco 04", "Preto", true),
      img("/catalogo/casacos/items/4/IMG_5081.JPG", "Casaco 04 detalhe", "Azul-marinho")
    ], ["#111111|Preto", "#15285f|Azul-marinho"]),
    product("conjunto-01", "conjuntos", "Conjunto 01", "", "", 1, [
      img("/catalogo/conjuntos/items/1/IMG_5060.JPG", "Conjunto 01", "Branco", true),
      img("/catalogo/conjuntos/items/1/IMG_5061.JPG", "Conjunto 01 detalhe", "Preto")
    ], ["#ffffff|Branco", "#111111|Preto"]),
    product("conjunto-02", "conjuntos", "Conjunto 02", "", "", 2, [
      img("/catalogo/conjuntos/items/2/IMG_5064.JPG", "Conjunto 02", "Rosa", true),
      img("/catalogo/conjuntos/items/2/IMG_5066.JPG", "Conjunto 02 detalhe", "Vermelho"),
      img("/catalogo/conjuntos/items/2/IMG_5067.JPG", "Conjunto 02 variação", "Preto")
    ], ["#f4a8bc|Rosa", "#c8102e|Vermelho"]),
    product("conjunto-03", "conjuntos", "Conjunto 03", "", "", 3, [
      img("/catalogo/conjuntos/items/3/e0ebede3-429f-4a47-abd2-25d45a0a92c9.JPG", "Conjunto 03", "Marrom", true)
    ], ["#5a3727|Marrom", "#c7aa83|Bege", "#0d6b43|Verde"]),
    product("conjunto-04", "conjuntos", "Conjunto 04", "", "", 4, [
      img("/catalogo/conjuntos/items/4/IMG_5077.JPG", "Conjunto 04", "Xadrez preto e branco", true),
      img("/catalogo/conjuntos/items/4/IMG_5078.JPG", "Conjunto 04 detalhe", "Xadrez preto e branco"),
      img("/catalogo/conjuntos/items/4/IMG_5082.JPG", "Conjunto 04 variação", "Cinza")
    ], ["#333333,#dddddd|Xadrez preto e branco"]),
    product("bota-01", "botas", "Bota 01", "", "", 1, [
      img("/catalogo/botas/items/Botas 1/IMG_5017.JPG", "Bota 01", "Dourado", true),
      img("/catalogo/botas/items/Botas 1/IMG_5018.JPG", "Bota 01 detalhe", "Dourado"),
      img("/catalogo/botas/items/Botas 1/IMG_5019.JPG", "Bota 01 variação", "Branca")
    ], ["#c9a84c|Dourado"]),
    product("bota-02", "botas", "Bota 02", "", "", 2, [
      img("/catalogo/botas/items/Botas 2/IMG_5072.JPG", "Bota 02", "Preto", true),
      img("/catalogo/botas/items/Botas 2/IMG_5087.JPG", "Bota 02 detalhe", "Preto")
    ], ["#111111|Preto"]),
    product("bota-03", "botas", "Bota 03", "", "", 3, [
      img("/catalogo/botas/items/Botas 3/IMG_5075.JPG", "Bota 03", "Preto", true),
      img("/catalogo/botas/items/Botas 3/IMG_5085.JPG", "Bota 03 detalhe", "Branco")
    ], ["#111111|Preto", "#ffffff|Branco"]),
    product("bota-04", "botas", "Bota 04", "", "", 4, [
      img("/catalogo/botas/items/Botas 4/IMG_5083.JPG", "Bota 04", "Preto", true)
    ], ["#111111|Preto"]),
    product("oculos-01", "botas", "Óculos de Neve", "", "", 5, [
      img("/catalogo/botas/items/Óculos/IMG_5086.JPG", "Óculos de neve", "Branco", true),
      img("/catalogo/botas/items/Óculos/IMG_5088.JPG", "Óculos de neve detalhe", "Preto"),
      img("/catalogo/botas/items/Óculos/IMG_5093.JPG", "Óculos de neve variação", "Rosa")
    ], ["#ffffff|Branco", "#111111|Preto"])
  ]
};

async function sync() {
  const data = initialCatalogData;
  console.log(`Pushing ${data.categories.length} categories and ${data.products.length} products...`);

  // Upsert Categories
  const { error: catError } = await supabase.from("categories").upsert(data.categories.map(c => ({
    id: c.id,
    name: c.name,
    tagline: c.tagline,
    tone: c.tone,
    order_index: c.order
  })));
  if (catError) console.error("Category error:", catError);

  // Upsert Products
  const { error: prodError } = await supabase.from("products").upsert(data.products.map(p => ({
    id: p.id,
    category_id: p.categoryId,
    name: p.name,
    subtitle: p.subtitle,
    price: p.price,
    clp_price: p.clpPrice || "",
    order_index: p.order,
    active: p.active,
    colors: p.colors
  })));
  if (prodError) console.error("Product error:", prodError);

  // Upsert Images
  const images = data.products.flatMap((product) =>
    product.images.map((image, index) => ({
      id: image.id,
      product_id: product.id,
      url: image.url,
      alt: image.alt,
      color: product.colors[index % product.colors.length] || "",
      is_cover: image.isCover || index === 0,
      order_index: index
    }))
  );
  if (images.length) {
    const { error: imgError } = await supabase.from("product_images").upsert(images);
    if (imgError) console.error("Image error:", imgError);
  }

  console.log("Done syncing initial data to Supabase!");
}

sync();
