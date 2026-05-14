import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { getCatalogData } from "@/lib/catalog-service";
import type { CatalogData, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

const photoPlaceholders = [
  "URL_FOTO_MACACAO_01",
  "URL_FOTO_MACACAO_02",
  "URL_FOTO_MACACAO_03",
  "URL_FOTO_MACACAO_04",
  "URL_FOTO_CASACO_01",
  "URL_FOTO_CASACO_02",
  "URL_FOTO_CASACO_03",
  "URL_FOTO_CASACO_04",
  "URL_FOTO_CASACO_05",
  "URL_FOTO_CONJUNTO_01",
  "URL_FOTO_CONJUNTO_02",
  "URL_FOTO_BOTA_01",
  "URL_FOTO_BOTA_02",
  "URL_FOTO_BOTA_03",
  "URL_FOTO_BOTA_04"
];

function extractHtmlParts(html: string) {
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/i);

  return {
    styles: styleMatch?.[1] || "",
    body: bodyMatch?.[1] || html
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function categoryClass(tone: string) {
  if (tone === "red") return "cat-macacao";
  if (tone === "blue") return "cat-casaco";
  if (tone === "dark") return "cat-bota";
  return "cat-acess";
}

function splitColorTag(color: string) {
  const [rawHex, ...nameParts] = color.split("|");
  const name = nameParts.join("|").trim();
  return {
    swatch: name ? rawHex.trim() : color.trim(),
    name: name || color.trim()
  };
}

function colorCss(color: string) {
  const { swatch } = splitColorTag(color);
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(swatch)) return swatch;
  const value = swatch.toLowerCase();
  if (value.includes("preto")) return "#111111";
  if (value.includes("branco") || value.includes("off-white")) return "#f4f0e8";
  if (value.includes("marrom")) return "#5a3727";
  if (value.includes("cinza") || value.includes("prata")) return "#9aa0a6";
  if (value.includes("rosa")) return "#f4a8bc";
  if (value.includes("vermelho")) return "#c8102e";
  if (value.includes("bege")) return "#c7aa83";
  if (value.includes("verde")) return "#0d6b43";
  if (value.includes("vinho")) return "#5b1230";
  if (value.includes("azul")) return "#15285f";
  if (value.includes("dourado")) return "#c9a84c";
  if (value.includes("animal")) return "linear-gradient(135deg,#d7c0a3 0 35%,#1f1a16 35% 52%,#d7c0a3 52% 70%,#1f1a16 70%)";
  if (value.includes("xadrez")) return "linear-gradient(45deg,#111 0 25%,#fff 25% 50%,#111 50% 75%,#fff 75%)";
  return "transparent";
}

function renderProductCard(product: Product) {
  const images = product.images.slice(0, 2);
  const imageColors = [...new Set(images.map((image) => image.color).filter(Boolean) as string[])];
  const colors = product.colors.length ? product.colors : imageColors;
  const activeColor = colors[0] || images[0]?.color || "";
  const colorDots = (colors.length ? colors : [""])
    .slice(0, 5)
    .map((color, index) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:5px;">
          <button type="button" class="produto-cor-btn${index === 0 ? " is-active" : ""}" data-color="${escapeHtml(color)}" title="${escapeHtml(splitColorTag(color).name)}" style="background:${colorCss(color)};"></button>
          <small style="font-family:'Montserrat',sans-serif;font-size:8px;line-height:1.1;color:rgba(255,255,255,0.62);text-align:center;max-width:70px;">${escapeHtml(splitColorTag(color).name)}</small>
        </div>`)
    .join("");

  return `
  <div class="produto-card" data-product-id="${escapeHtml(product.id)}" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="display:flex;align-items:stretch;min-height:300px;">
      <div style="flex:1;background:linear-gradient(135deg,#1a1a2e,#0a1628);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;">
        ${
          images.length
            ? `<div class="produto-carousel" aria-label="${escapeHtml(product.name)}">
                ${images.map((image) => {
                  const imageColor = image.color || activeColor;
                  return `<div class="produto-slide" data-color="${escapeHtml(imageColor)}"><img src="${escapeHtml(image.url)}" alt="${escapeHtml(image.alt)}"></div>`;
                }).join("")}
              </div>
              ${images.length > 1 ? `<div class="produto-dots">${images.map((image, index) => {
                const imageColor = image.color || activeColor;
                return `<span data-color="${escapeHtml(imageColor)}">${index + 1}</span>`;
              }).join("")}</div>` : ""}`
            : `<span style="font-family:'Montserrat',sans-serif;color:rgba(255,255,255,0.45);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Foto do produto</span>`
        }
      </div>
      <div style="
        width:115px;background:#0A1628;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:20px;padding:24px 12px;flex-shrink:0;
        border-left:1px solid rgba(201,168,76,0.15);
      ">
        <p style="font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--dourado);text-align:center;line-height:1.7;">Cores<br>Disponíveis</p>
        ${colorDots}
      </div>
    </div>
  </div>`;
}

function renderProductsSection(data: CatalogData) {
  return [...data.categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => {
      const products = data.products
        .filter((product) => product.active && product.categoryId === category.id)
        .sort((a, b) => a.order - b.order);

      if (!products.length) return "";

      return `
<div class="prod-cat-header ${categoryClass(category.tone)}"><h2>${escapeHtml(category.name)}</h2><p>${escapeHtml(category.tagline)}</p></div>
<div class="prod-grid">
${products.map(renderProductCard).join("\n")}
</div>`;
    })
    .join("\n");
}

async function getOriginalCatalogHtml() {
  const files = await readdir(process.cwd());
  const htmlFile = files.find((file) => file.toLowerCase().endsWith(".html"));

  if (!htmlFile) {
    throw new Error("Arquivo HTML do catálogo original não encontrado.");
  }

  return readFile(path.join(process.cwd(), htmlFile), "utf8");
}

export default async function Home() {
  const data = await getCatalogData();
  const originalHtml = await getOriginalCatalogHtml();
  const { styles, body } = extractHtmlParts(originalHtml);
  const carouselStyles = `
  .produto-carousel {
    width: 100%;
    height: 300px;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }
  .produto-carousel::-webkit-scrollbar { display: none; }
  .produto-slide {
    flex: 0 0 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: center;
  }
  .produto-slide img {
    max-width: 75%;
    max-height: 90%;
    object-fit: contain;
    object-position: center bottom;
    display: block;
    margin: auto;
  }
  .produto-dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 10px;
    display: flex;
    justify-content: center;
    gap: 6px;
    pointer-events: none;
  }
  .produto-dots span {
    width: 18px;
    height: 3px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255,255,255,0.75);
    color: transparent;
  }
  .produto-cor-btn {
    width: 38px;
    height: 38px;
    border: 2px solid rgba(201,168,76,0.5);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: inset 0 0 0 2px rgba(255,255,255,0.18);
  }
  .produto-cor-btn.is-active {
    border-color: var(--dourado);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.22), inset 0 0 0 2px rgba(255,255,255,0.22);
  }
  #placeholder-logo-capa,
  #placeholder-logo-rodape {
    background: rgba(255,255,255,0.94) !important;
    border: 1px solid rgba(201,168,76,0.32) !important;
    border-radius: 18px !important;
    padding: 18px !important;
    box-shadow: 0 14px 42px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.24) inset !important;
  }
  #placeholder-logo-capa img,
  #placeholder-logo-rodape img {
    filter: none !important;
  }
  @media (min-width: 768px) {
    body {
      max-width: none !important;
      margin: 0 !important;
      background: #f5f0e8 !important;
    }
    body > div {
      width: 100%;
      overflow: hidden;
      background: #fff;
    }
    body > div > section:first-child {
      max-width: none !important;
      min-height: 92vh !important;
    }
    .quem-somos,
    .localizacao,
    .como-alugar,
    .precos,
    .rodape,
    .produtos-intro {
      padding-left: max(64px, calc((100vw - 1120px) / 2)) !important;
      padding-right: max(64px, calc((100vw - 1120px) / 2)) !important;
    }
    .qs-texto,
    .localizacao > p:not(.subtitulo),
    .rodape-slogan {
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    .titulo {
      font-size: 52px !important;
    }
    .prod-cat-header {
      padding: 28px max(64px, calc((100vw - 1120px) / 2)) !important;
    }
    .prod-cat-header h2 {
      font-size: 36px !important;
    }
    .prod-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)) !important;
      gap: 32px !important;
      padding: 40px max(64px, calc((100vw - 1120px) / 2)) !important;
      align-items: stretch;
    }
    .produto-card {
      height: 100%;
    }
    .produto-card > div {
      min-height: 420px !important;
    }
    .produto-carousel,
    .produto-slide {
      height: 420px !important;
    }
    .produto-slide img {
      max-width: 82%;
      max-height: 92%;
    }
    .kit-card {
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
    .steps,
    .contatos {
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    }
  }`;
  const colorFilterScript = `
  document.addEventListener('click', function (event) {
    var button = event.target.closest('.produto-cor-btn');
    if (!button) return;
    var card = button.closest('.produto-card');
    if (!card) return;
    var color = button.getAttribute('data-color') || '';
    var hasTaggedPhoto = false;
    card.querySelectorAll('.produto-slide').forEach(function (slide) {
      if ((slide.getAttribute('data-color') || '') === color) hasTaggedPhoto = true;
    });
    card.querySelectorAll('.produto-cor-btn').forEach(function (item) {
      item.classList.toggle('is-active', item === button);
    });
    var shown = 0;
    card.querySelectorAll('.produto-slide').forEach(function (slide) {
      var visible = hasTaggedPhoto ? (slide.getAttribute('data-color') || '') === color : true;
      slide.style.display = visible ? 'flex' : 'none';
      if (visible) shown += 1;
    });
    card.querySelectorAll('.produto-dots span').forEach(function (dot) {
      var visible = hasTaggedPhoto ? (dot.getAttribute('data-color') || '') === color : true;
      dot.style.display = visible && shown > 1 ? 'block' : 'none';
    });
    var carousel = card.querySelector('.produto-carousel');
    if (carousel) carousel.scrollTo({ left: 0, behavior: 'smooth' });
  });`;

  let renderedBody = body.replaceAll("URL_LOGO_AQUI", "/catalogo/logos/logo-original.png");
  const productsStart = renderedBody.indexOf('<div class="prod-cat-header cat-macacao">');
  const productsEnd = renderedBody.indexOf("<!-- COMO ALUGAR -->");

  if (productsStart >= 0 && productsEnd > productsStart) {
    renderedBody = `${renderedBody.slice(0, productsStart)}${renderProductsSection(data)}\n\n${renderedBody.slice(productsEnd)}`;
  } else {
    photoPlaceholders.forEach((placeholder) => {
      renderedBody = renderedBody.replaceAll(placeholder, "");
    });
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `${styles}\n${carouselStyles}` }} />
      <div dangerouslySetInnerHTML={{ __html: renderedBody }} />
      <script dangerouslySetInnerHTML={{ __html: colorFilterScript }} />
    </>
  );
}
