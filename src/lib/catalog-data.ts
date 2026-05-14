import type { CatalogData, Product } from "./types";

const img = (url: string, alt: string, color?: string, isCover = false) => ({
  id: url,
  url,
  alt,
  color,
  isCover
});

const product = (
  id: string,
  categoryId: string,
  name: string,
  subtitle: string,
  price: string,
  order: number,
  images: ReturnType<typeof img>[],
  colors: string[]
): Product => ({
  id,
  categoryId,
  name,
  subtitle,
  price,
  order,
  active: true,
  images: images.slice(0, 2),
  colors
});

export const initialCatalogData: CatalogData = {
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
    ], ["Preto", "Marrom"]),
    product("macacao-02", "macacoes", "Macacão 02", "", "", 2, [
      img("/catalogo/macacoes/items/2/IMG_5052.JPG", "Macacão 02", "Cinza", true),
      img("/catalogo/macacoes/items/2/IMG_5053.JPG", "Macacão 02 detalhe", "Preto"),
      img("/catalogo/macacoes/items/2/IMG_5054.JPG", "Macacão 02 variação", "Preto")
    ], ["Cinza", "Preto"]),
    product("macacao-03", "macacoes", "Macacão 03", "", "", 3, [
      img("/catalogo/macacoes/items/3/IMG_5057.JPG", "Macacão 03", "Rosa", true),
      img("/catalogo/macacoes/items/3/IMG_5058.JPG", "Macacão 03 detalhe", "Bege"),
      img("/catalogo/macacoes/items/3/IMG_5059.JPG", "Macacão 03 variação", "Preto")
    ], ["Rosa", "Bege"]),
    product("macacao-04", "macacoes", "Macacão 04", "", "", 4, [
      img("/catalogo/macacoes/items/4/IMG_5074.JPG", "Macacão 04", "Preto", true),
      img("/catalogo/macacoes/items/4/IMG_5090.JPG", "Macacão 04 detalhe", "Cinza"),
      img("/catalogo/macacoes/items/4/IMG_5091.JPG", "Macacão 04 variação", "Branco")
    ], ["Preto", "Cinza"]),
    product("macacao-05", "macacoes", "Macacão 05", "", "", 5, [
      img("/catalogo/macacoes/items/5/25e1339b-7609-4ed9-80b2-e219339da99f.JPG", "Macacão 05", "Marrom", true)
    ], ["Marrom", "Off-white"]),
    product("macacao-06", "macacoes", "Macacão 06", "", "", 6, [
      img("/catalogo/macacoes/items/6/32b07301-c078-414d-b776-dd77db876096.JPG", "Macacão 06", "Rosa claro", true)
    ], ["Rosa claro"]),
    product("macacao-07", "macacoes", "Macacão 07", "", "", 7, [
      img("/catalogo/macacoes/items/7/d62ec155-7d26-465d-9df6-2d2b7a50d4e0.JPG", "Macacão 07", "Off-white", true)
    ], ["Off-white", "Preto", "Bege"]),
    product("casaco-01", "casacos", "Casaco 01", "", "", 1, [
      img("/catalogo/casacos/items/1/IMG_5030.JPG", "Casaco 01", "Verde", true),
      img("/catalogo/casacos/items/1/IMG_5031.JPG", "Casaco 01 detalhe", "Vermelho")
    ], ["Verde", "Vermelho"]),
    product("casaco-02", "casacos", "Casaco 02", "", "", 2, [
      img("/catalogo/casacos/items/2/IMG_5032.JPG", "Casaco 02", "Vinho", true),
      img("/catalogo/casacos/items/2/IMG_5033.JPG", "Casaco 02 detalhe", "Preto"),
      img("/catalogo/casacos/items/2/IMG_5034.JPG", "Casaco 02 variação", "Bege")
    ], ["Vinho", "Preto"]),
    product("casaco-03", "casacos", "Casaco 03", "", "", 3, [
      img("/catalogo/casacos/items/3/IMG_5071.JPG", "Casaco 03", "Prata", true)
    ], ["Prata", "Vinho", "Preto", "Animal print"]),
    product("casaco-04", "casacos", "Casaco 04", "", "", 4, [
      img("/catalogo/casacos/items/4/IMG_5080.JPG", "Casaco 04", "Preto", true),
      img("/catalogo/casacos/items/4/IMG_5081.JPG", "Casaco 04 detalhe", "Azul-marinho")
    ], ["Preto", "Azul-marinho"]),
    product("conjunto-01", "conjuntos", "Conjunto 01", "", "", 1, [
      img("/catalogo/conjuntos/items/1/IMG_5060.JPG", "Conjunto 01", "Branco", true),
      img("/catalogo/conjuntos/items/1/IMG_5061.JPG", "Conjunto 01 detalhe", "Preto")
    ], ["Branco", "Preto"]),
    product("conjunto-02", "conjuntos", "Conjunto 02", "", "", 2, [
      img("/catalogo/conjuntos/items/2/IMG_5064.JPG", "Conjunto 02", "Rosa", true),
      img("/catalogo/conjuntos/items/2/IMG_5066.JPG", "Conjunto 02 detalhe", "Vermelho"),
      img("/catalogo/conjuntos/items/2/IMG_5067.JPG", "Conjunto 02 variação", "Preto")
    ], ["Rosa", "Vermelho"]),
    product("conjunto-03", "conjuntos", "Conjunto 03", "", "", 3, [
      img("/catalogo/conjuntos/items/3/e0ebede3-429f-4a47-abd2-25d45a0a92c9.JPG", "Conjunto 03", "Marrom", true)
    ], ["Marrom", "Bege", "Verde"]),
    product("conjunto-04", "conjuntos", "Conjunto 04", "", "", 4, [
      img("/catalogo/conjuntos/items/4/IMG_5077.JPG", "Conjunto 04", "Xadrez preto e branco", true),
      img("/catalogo/conjuntos/items/4/IMG_5078.JPG", "Conjunto 04 detalhe", "Xadrez preto e branco"),
      img("/catalogo/conjuntos/items/4/IMG_5082.JPG", "Conjunto 04 variação", "Cinza")
    ], ["Xadrez preto e branco"]),
    product("bota-01", "botas", "Bota 01", "", "", 1, [
      img("/catalogo/botas/items/Botas 1/IMG_5017.JPG", "Bota 01", "Dourado", true),
      img("/catalogo/botas/items/Botas 1/IMG_5018.JPG", "Bota 01 detalhe", "Dourado"),
      img("/catalogo/botas/items/Botas 1/IMG_5019.JPG", "Bota 01 variação", "Branca")
    ], ["Dourado"]),
    product("bota-02", "botas", "Bota 02", "", "", 2, [
      img("/catalogo/botas/items/Botas 2/IMG_5072.JPG", "Bota 02", "Preto", true),
      img("/catalogo/botas/items/Botas 2/IMG_5087.JPG", "Bota 02 detalhe", "Preto")
    ], ["Preto"]),
    product("bota-03", "botas", "Bota 03", "", "", 3, [
      img("/catalogo/botas/items/Botas 3/IMG_5075.JPG", "Bota 03", "Preto", true),
      img("/catalogo/botas/items/Botas 3/IMG_5085.JPG", "Bota 03 detalhe", "Branco")
    ], ["Preto", "Branco"]),
    product("bota-04", "botas", "Bota 04", "", "", 4, [
      img("/catalogo/botas/items/Botas 4/IMG_5083.JPG", "Bota 04", "Preto", true)
    ], ["Preto"]),
    product("oculos-01", "botas", "Óculos de Neve", "", "", 5, [
      img("/catalogo/botas/items/Óculos/IMG_5086.JPG", "Óculos de neve", "Branco", true),
      img("/catalogo/botas/items/Óculos/IMG_5088.JPG", "Óculos de neve detalhe", "Preto"),
      img("/catalogo/botas/items/Óculos/IMG_5093.JPG", "Óculos de neve variação", "Rosa")
    ], ["Branco", "Preto"])
  ]
};
