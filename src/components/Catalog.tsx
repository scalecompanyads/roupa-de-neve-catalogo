"use client";

import Image from "next/image";
import { initialCatalogData } from "@/lib/catalog-data";
import type { CatalogData, Product } from "@/lib/types";

type Props = {
  data?: CatalogData;
};

const toneClass = {
  red: "cat-red",
  blue: "cat-blue",
  dark: "cat-dark",
  gold: "cat-gold"
};

function ProductCard({ product }: { product: Product }) {
  const cover = product.images.find((image) => image.isCover) || product.images[0];

  return (
    <article className="catalog-product">
      <div className="product-stage">
        {cover ? (
          <Image src={cover.url} alt={cover.alt} width={720} height={900} className="product-image" />
        ) : (
          <div className="product-empty">Foto do produto</div>
        )}
      </div>
      <aside className="product-colors">
        <span>Cores<br />Disponíveis</span>
        {product.colors.slice(0, 5).map((color) => (
          <div className="color-dot" title={color} key={color}>{color.slice(0, 1)}</div>
        ))}
      </aside>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <strong>{product.price}</strong>
        {product.clpPrice ? <small>{product.clpPrice}</small> : null}
      </div>
    </article>
  );
}

export function Catalog({ data = initialCatalogData }: Props) {
  const categories = [...data.categories].sort((a, b) => a.order - b.order);
  const products = data.products.filter((item) => item.active);

  return (
    <main className="catalog-shell">
      <section className="cover-section">
        <div className="snow" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, index) => <span key={index}>*</span>)}
        </div>
        <Image src="/catalogo/logos/logo-original.png" alt="Nevou no Chile" width={360} height={260} className="cover-logo" priority />
        <p>Catálogo de Aluguel</p>
        <div className="cover-line"><i />Santiago · Chile<i /></div>
      </section>

      <section className="about-section">
        <p className="eyebrow">Nossa história</p>
        <h1>Quem <em>Somos</em></h1>
        <div className="divider" />
        <p>
          A <strong>Nevou no Chile</strong> nasceu para elevar a experiência de quem sonha viver a neve com estilo e praticidade.
          Somos uma empresa brasileira especializada em aluguel de roupas femininas e masculinas específicas para atividades na neve
          e roupas casuais para te manter protegido e elegante no frio.
        </p>
        <p><strong>Nevou no Chile? Vista-se à altura!</strong></p>
      </section>

      <section className="products-intro">
        <p className="eyebrow">Catálogo</p>
        <h2>Looks para <em>Neve</em></h2>
        <p>Peças organizadas por categoria, com cores disponíveis e fotos reais do acervo.</p>
      </section>

      {categories.map((category) => (
        <section key={category.id}>
          <header className={`category-header ${toneClass[category.tone]}`}>
            <h2>{category.name}</h2>
            <p>{category.tagline}</p>
          </header>
          <div className="product-grid">
            {products
              .filter((product) => product.categoryId === category.id)
              .sort((a, b) => a.order - b.order)
              .map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        </section>
      ))}

      <section className="how-section">
        <p className="eyebrow">Passo a passo</p>
        <h2>Como Alugar<br /><em>Seu Look</em></h2>
        <div className="steps">
          {[
            ["1", "Faça a sua reserva", "Entre em contato pelo WhatsApp e agende seu horário para um atendimento personalizado."],
            ["2", "Escolha a data", "O ideal é reservar um dia antes do passeio, pois o aluguel é por diária."],
            ["3", "Visite nossa loja", "No horário agendado, escolha seus looks e prepare-se para aproveitar a neve."],
            ["4", "Devolução", "A devolução deve ser feita até as 20h do dia seguinte."],
            ["5", "Finalização", "Após a conferência, pronto: simples, prático e sem complicações."]
          ].map(([number, title, text]) => (
            <div className="step" key={number}>
              <b>{number}</b>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="prices-section">
        <p className="eyebrow">Tabela de Valores</p>
        <h2>Nossos <em>Kits</em></h2>
        {[
          ["Kit Essencial", ["Macacão + 1 acessório — R$ 115,00 ou 19.000 CLP", "Macacão + 2 acessórios — R$ 199 ou CLP 34.999", "Macacão + 2 acessórios + bota essencial — R$ 299 ou CLP 52.999"]],
          ["Kit Premium", ["Macacão — R$ 299 ou CLP 50.000", "Macacão + 2 acessórios — R$ 400 ou CLP 69.000", "Macacão + 2 acessórios + bota premium — R$ 500 ou CLP 86.000"]],
          ["Kit Exclusivo", ["Macacão — R$ 399 ou CLP 68.000", "Macacão + 2 acessórios + bota premium — R$ 550 ou CLP 95.900"]],
          ["Itens Avulsos", ["Casacos e capas — a partir de R$ 199", "Botas — a partir de R$ 80", "Macacões térmicos — a partir de R$ 80"]]
        ].map(([title, lines]) => (
          <div className="kit-card" key={title as string}>
            <h3>{title as string}</h3>
            {(lines as string[]).map((line) => <p key={line}>{line}</p>)}
          </div>
        ))}
      </section>

      <footer className="footer-section">
        <Image src="/catalogo/logos/logo-original.png" alt="Nevou no Chile" width={340} height={230} />
        <p>General Holley 2363, sala 502, Providencia, Santiago</p>
        <p>10h30 às 21h00 · Todos os dias</p>
        <p>+55 21 97322-1855</p>
      </footer>
    </main>
  );
}
