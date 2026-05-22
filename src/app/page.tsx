import { getCatalogData } from "@/lib/catalog-service";
import type { CatalogData, Product } from "@/lib/types";
import CatalogScript from "@/components/CatalogScript";
import { splitColorTag, colorCss } from "@/lib/color-utils";

export const dynamic = "force-dynamic";

/* ─── helpers ─── */
function categoryBg(tone: string) {
  if (tone === "red") return "var(--vermelho)";
  if (tone === "blue") return "var(--azul)";
  if (tone === "dark") return "var(--azul-escuro)";
  return "linear-gradient(135deg,var(--vermelho-escuro),var(--vermelho))";
}

/* ─── Sub-components ─── */
function SnowFlakes() {
  return (
    <div className="snow" aria-hidden="true">
      {["❄","❅","❆","❄","❅","❆","❄","❅"].map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const images = product.images;
  const imageColors = [...new Set(images.map(img => img.color).filter(Boolean) as string[])];
  const colors = product.colors.length ? product.colors : imageColors;

  return (
    <div className="catalog-product" data-product-id={product.id}>
      {/* image stage with full carousel */}
      <div className="product-stage" style={{ position: "relative", overflow: "hidden" }}>
        {images.length ? (
          <>
            <div
              className="produto-carousel"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
              }}
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  className="produto-slide"
                  data-color={img.color || ""}
                  style={{
                    flex: "0 0 100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scrollSnapAlign: "center",
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="product-image"
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button type="button" className="carousel-arrow carousel-prev" aria-label="Anterior">❮</button>
                <button type="button" className="carousel-arrow carousel-next" aria-label="Próximo">❯</button>
                <div
                  className="produto-dots"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 10,
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    pointerEvents: "none",
                  }}
                >
                  {images.map((img) => (
                    <span
                      key={img.id}
                      data-color={img.color || ""}
                      style={{
                        width: 18,
                        height: 3,
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.75)",
                        display: "block",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <span className="product-empty">Foto do produto</span>
        )}
      </div>

      {/* colors panel */}
      <div className="product-colors">
        <span>Cores<br />Disponíveis</span>
        {(colors.length ? colors : [""]).slice(0, 5).map((color, i) => {
          const { name } = splitColorTag(color);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <button
                type="button"
                className={`produto-cor-btn${i === 0 ? " is-active" : ""}`}
                data-color={color}
                title={name}
                style={{ background: colorCss(color), width: 38, height: 38, border: "2px solid rgba(201,168,76,0.5)", borderRadius: "50%", cursor: "pointer", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.18)" }}
              />
              <small style={{ fontFamily: "Montserrat,sans-serif", fontSize: 8, color: "rgba(255,255,255,0.62)", textAlign: "center", maxWidth: 70, lineHeight: 1.1 }}>{name}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductsSection({ data }: { data: CatalogData }) {
  const sorted = [...data.categories].sort((a, b) => a.order - b.order);
  return (
    <>
      {sorted.map(cat => {
        const products = data.products
          .filter(p => p.active && p.categoryId === cat.id)
          .sort((a, b) => a.order - b.order);
        if (!products.length) return null;
        return (
          <div key={cat.id}>
            <div className="category-header" style={{ background: categoryBg(cat.tone) }}>
              <h2>{cat.name}</h2>
              <p>{cat.tagline}</p>
            </div>
            <div className="product-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ─── Main page ─── */
export default async function Home() {
  const data = await getCatalogData();

  return (
    <>
      <CatalogScript />
      <div className="catalog-shell">

        {/* ── CAPA ── */}
        <section className="cover-section">
          <SnowFlakes />
          <div style={{ position:"relative", zIndex:1, width:300, maxWidth:"82%", height:200, margin:"0 auto 8px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <img src="/catalogo/logos/logo-branca.png" alt="Logo Nevou no Chile" style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }} />
          </div>
          <p className="eyebrow" style={{ position:"relative", zIndex:1, color: "var(--dourado)" }}>Temporada de Neve · Chile</p>
          <div className="cover-line" style={{ position:"relative", zIndex:1 }}>
            <i /><span>Roupas de Neve · Aluguel Premium</span><i />
          </div>
        </section>

        {/* ── QUEM SOMOS ── */}
        <section className="about-section">
          <p className="eyebrow">Nossa História</p>
          <h2>Quem <em>Somos</em></h2>
          <div className="divider" />
          <p className="about-text">
            A <strong>Nevou no Chile</strong> nasceu para elevar a experiência de quem sonha viver a neve com estilo e praticidade. Somos uma empresa brasileira especializada em aluguel de roupas femininas e masculinas específicas para atividades na neve e roupas casuais para te manter protegido e elegante no frio. Não basta estar aquecido, é preciso estar bem vestido, com sofisticação e presença!
          </p>
          <div className="about-image-container">
            <img src="/catalogo/IMG_3826.jpg" alt="Equipe Nevou no Chile" className="about-image" />
          </div>
          <p className="about-text">
            Nosso propósito vai além do aluguel: queremos que cada cliente se sinta confiante, confortável e estiloso, sem preocupações e sem excessos na bagagem! Selecionamos peças modernas, elegantes e funcionais para transformar sua viagem em uma experiência memorável.
            <br /><br />
            <strong>Nevou no Chile? Vista-se à altura!</strong>
          </p>
        </section>

        <section className="info-banner-section">
          <p className="info-banner-kicker">Kits a partir de R$115,00</p>
          <p className="info-banner-text">Em caso de passeio cancelado, crédito de<br />100% na loja</p>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="location-section" style={{ background:"var(--azul-escuro)", padding:"60px 32px", textAlign:"center", color:"#fff" }}>
          <p className="eyebrow">Onde nos encontrar</p>
          <h2 style={{ color:"#fff", fontSize:34, fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>Localização e <em style={{ color:"var(--dourado)", fontStyle: "italic" }}>Horários</em></h2>
          <div className="divider" />
          
          <div className="about-image-container" style={{ maxWidth: 380, margin: "0 auto 32px" }}>
            <img src="/catalogo/Cópia%20de%20IMG_9776.jpg" alt="Nevou no Chile Localização" className="about-image" />
          </div>

          <div className="loc-box">
            {[
              { label:"📍 Localização", val:"Santiago, Chile" },
              { label:"🕐 Horário de Funcionamento", val:"Todos os dias das 10h30 às 21h00" },
              { label:"📱 WhatsApp", val:"+55 21 97322-1855" },
            ].map(({ label, val }) => (
              <div key={label} className="loc-row">
                <p className="loc-label">{label}</p>
                <p className="loc-val">{val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── DIFERENCIAIS ── */}
        <section style={{ background:"var(--creme)", padding:"60px 32px", textAlign:"center" }}>
          <p className="eyebrow">Por que escolher</p>
          <h2 style={{ color:"var(--azul-escuro)" }}>Diferenciais da <em>Nevou no Chile</em></h2>
          <div className="divider" />
          <div style={{ display:"flex", flexDirection:"column", gap:14, marginTop:8 }}>
            {[
              ["✨","Curadoria de estilo que valoriza você","Não é só roupa de neve, são peças escolhidas estrategicamente para unir estética, conforto e performance, garantindo que você se sinta confiante e bem vestido em qualquer cenário."],
              ["🧼","Higiene impecável e padrão elevado","Cada peça passa por um processo rigoroso de limpeza, higienização e revisão, para você usar com total segurança e tranquilidade."],
              ["🏔️","Looks pensados para cada tipo de viagem","Do básico funcional ao visual mais sofisticado para fotos e experiências. Opções que se adaptam ao seu estilo, roteiro e orçamento."],
              ["🤝","Atendimento consultivo","Você não escolhe sozinho. Nós te orientamos na montagem do look ideal, considerando clima, destino e até os registros que você quer fazer."],
              ["🎒","Praticidade real na sua viagem","Evite excesso de bagagem, compras desnecessárias e erros comuns. Você chega pronto, com tudo certo, sem dor de cabeça."],
              ["🔄","Flexibilidade que acompanha você","Ajustes, trocas e suporte pensados para imprevistos, porque viagem de verdade nem sempre sai 100% como planejado."],
              ["⭐","Peças revisadas para performance na neve","Nada de passar frio ou desconforto: nossos itens são preparados para proteger de verdade, não só \"compor look\"."],
              ["🌟","Experiência completa","Do primeiro contato até a devolução, tudo é pensado para ser simples, rápido e sem fricção."],
            ].map(([ico, title, desc]) => (
              <div key={title as string} style={{ display:"flex", gap:16, padding:"18px 20px", background:"#fff", borderRadius:14, textAlign:"left", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize:28, flexShrink:0 }}>{ico}</div>
                <div>
                  <p style={{ margin:"0 0 4px", fontFamily:"Playfair Display,serif", fontSize:16, fontWeight:700, color:"var(--azul-escuro)" }}>{title as string}</p>
                  <p style={{ margin:0, fontSize:13, color:"#555", lineHeight:1.6 }}>{desc as string}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUTOS ── */}
        <section className="products-intro">
          <p className="eyebrow">Nosso Catálogo</p>
          <h2>Nossos <em>Produtos</em></h2>
          <div className="divider" style={{ background:"rgba(201,168,76,0.6)" }} />
          <p>Peças selecionadas para garantir conforto e estilo na neve</p>
        </section>
        <ProductsSection data={data} />

        {/* ── COMO ALUGAR ── */}
        <section className="how-section">
          <p className="eyebrow">Passo a passo</p>
          <h2 style={{ color:"#fff" }}>Como Alugar<br /><em>Seu Look</em></h2>
          <div className="divider" />
          <div className="steps">
            {[
              ["1","Faça a sua reserva","Acesse o link na bio do nosso Instagram ou entre em contato pelo WhatsApp. Trabalhamos com horários agendados para garantir um atendimento personalizado.","⚠️ Realizamos reserva de horários, não de peças específicas."],
              ["2","Escolha a data","O ideal é reservar um dia antes do seu passeio, pois o aluguel é por diária.",null],
              ["3","Visite Nossa Loja","No dia e horário agendados, venha até a Nevou no Chile, escolha seus looks e prepare-se para arrasar na neve!",null],
              ["4","Devolução","Deve ser feita até as 20h do dia seguinte. Atrasos resultam na cobrança de uma nova diária.",null],
              ["5","Finalização","Após a devolução, fazemos uma conferência rápida e pronto! Fácil, prático e sem complicações. Agora é só curtir sua experiência na neve! 🇨🇱",null],
            ].map(([num, title, desc, obs]) => (
              <div key={num as string} className="step">
                <b>{num}</b>
                <div>
                  <h3>{title as string}</h3>
                  <p>{desc as string}</p>
                  {obs && <p style={{ marginTop:8, fontSize:12, color:"rgba(255,255,255,0.5)" }}>{obs as string}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PREÇOS ── */}
        <section className="prices-section">
          <p className="eyebrow">Tabela de Valores</p>
          <h2 style={{ color:"var(--azul-escuro)" }}>Nossos <em>Kits</em></h2>
          <div className="divider" />

          {/* Kit Essencial */}
          <div className="kit-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <h3 style={{ margin:0, fontFamily:"Playfair Display,serif", color:"var(--azul-escuro)", fontSize:22 }}>Kit Essencial</h3>
                <small style={{ color:"#888", letterSpacing:1, textTransform:"uppercase", fontSize:11 }}>Essential</small>
              </div>
              <span style={{ background:"rgba(201,168,76,0.15)", color:"var(--dourado)", borderRadius:8, padding:"6px 12px", fontSize:18 }}>⭐</span>
            </div>
            {[["Macacão + 1 acessório","R$ 115,00 ou 19.000 CLP"],["Macacão + 2 acessórios","R$ 199 ou CLP 34.999"],["Macacão + 2 acessórios + bota essencial","R$ 299 ou CLP 52.999"]].map(([desc, price]) => (
              <div key={desc} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(0,0,0,0.06)", fontSize:13 }}>
                <span style={{ color:"#444" }}>{desc}</span>
                <span style={{ color:"var(--azul-escuro)", fontWeight:700 }}>{price}</span>
              </div>
            ))}
          </div>

          {/* Kit Premium */}
          <div className="kit-card" style={{ marginTop:16, borderLeft:"4px solid var(--dourado)", background:"#fdf9f0" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <h3 style={{ margin:0, fontFamily:"Playfair Display,serif", color:"var(--azul-escuro)", fontSize:22 }}>Kit Premium</h3>
                <small style={{ color:"#888", letterSpacing:1, textTransform:"uppercase", fontSize:11 }}>Premium</small>
              </div>
              <span style={{ background:"rgba(201,168,76,0.3)", color:"var(--dourado)", borderRadius:8, padding:"6px 12px", fontSize:18 }}>⭐⭐</span>
            </div>
            {[["Macacão","R$ 299 ou CLP 50.000"],["Macacão + 1 acessório","R$ 350 ou CLP 60.000"],["Macacão + 2 acessórios","R$ 400 ou CLP 69.000"],["Macacão + 2 acessórios + bota essencial","R$ 450 ou CLP 77.000"],["Macacão + 2 acessórios + bota premium","R$ 500 ou CLP 86.000"]].map(([desc, price]) => (
              <div key={desc} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(0,0,0,0.06)", fontSize:13 }}>
                <span style={{ color:"#444" }}>{desc}</span>
                <span style={{ color:"var(--azul-escuro)", fontWeight:700 }}>{price}</span>
              </div>
            ))}
          </div>

          {/* Kit Exclusivo */}
          <div className="kit-card" style={{ marginTop:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <h3 style={{ margin:0, fontFamily:"Playfair Display,serif", color:"var(--azul-escuro)", fontSize:22 }}>Kit Exclusivo</h3>
                <small style={{ color:"#888", letterSpacing:1, textTransform:"uppercase", fontSize:11 }}>Exclusive</small>
              </div>
              <span style={{ background:"rgba(201,168,76,0.15)", color:"var(--dourado)", borderRadius:8, padding:"6px 12px", fontSize:18 }}>⭐⭐⭐</span>
            </div>
            {[["Macacão","R$ 399 ou CLP 68.000"],["Macacão + 1 acessório + bota essencial","R$ 450 ou CLP 77.000"],["Macacão + 2 acessórios + bota essencial","R$ 500 ou CLP 86.000"],["Macacão + 2 acessórios + bota premium","R$ 550 ou CLP 95.900"]].map(([desc, price]) => (
              <div key={desc} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(0,0,0,0.06)", fontSize:13 }}>
                <span style={{ color:"#444" }}>{desc}</span>
                <span style={{ color:"var(--azul-escuro)", fontWeight:700 }}>{price}</span>
              </div>
            ))}
          </div>

          {/* Kit Sunset */}
          <div className="kit-card" style={{ marginTop:16, background:"#e8f0fc", borderLeft:"4px solid var(--azul)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <h3 style={{ margin:0, fontFamily:"Playfair Display,serif", color:"var(--azul-escuro)", fontSize:22 }}>Kit Sunset</h3>
                <small style={{ color:"#888", letterSpacing:1, textTransform:"uppercase", fontSize:11 }}>Para eventos na cordilheira</small>
              </div>
              <span style={{ background:"rgba(13,45,107,0.15)", color:"var(--azul-escuro)", borderRadius:8, padding:"6px 12px", fontSize:18 }}>🌅</span>
            </div>
            <p style={{ margin:"0 0 8px", fontSize:13, color:"#555", lineHeight:1.6 }}>Perfeito para eventos de sunset na cordilheira — indicado para quem não vai esquiar, mas participará de experiências na neve.</p>
            <p style={{ margin:0, fontWeight:700, color:"var(--azul-escuro)", fontSize:14 }}>A partir de R$ 299 ou CLP 51.000</p>
          </div>

          {/* Itens Avulsos */}
          <div className="kit-card" style={{ marginTop:16 }}>
            <h3 style={{ margin:"0 0 12px", fontFamily:"Playfair Display,serif", color:"var(--azul-escuro)", fontSize:22 }}>Itens Avulsos</h3>
            {[["Casacos e capas","A partir de R$ 199 ou CLP 34.000"],["Botas","A partir de R$ 80 ou CLP 13.000"],["Macacões Térmicos","A partir de R$ 80 ou CLP 13.000"]].map(([desc, price]) => (
              <div key={desc} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(0,0,0,0.06)", fontSize:13 }}>
                <span style={{ color:"#444" }}>{desc}</span>
                <span style={{ color:"var(--azul-escuro)", fontWeight:700 }}>{price}</span>
              </div>
            ))}
          </div>

          {/* Checks */}
          <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:10 }}>
            {["Kits higienizados e prontos para uso","Atendimento para te indicar o kit ideal","Evite comprar roupas que você usará apenas uma vez"].map(t => (
              <div key={t} style={{ display:"flex", gap:12, alignItems:"center", fontSize:13, color:"#444" }}>
                <div style={{ width:28, height:28, background:"var(--azul)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, flexShrink:0 }}>✓</div>
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* ── FORMAS DE PAGAMENTO ── */}
        <section style={{ background:"var(--azul)", padding:"48px 28px" }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:12, letterSpacing:4, color:"var(--dourado)", textTransform:"uppercase", marginBottom:8 }}>Facilidade para você</p>
            <h2 style={{ fontFamily:"Playfair Display,serif", fontSize:28, color:"#fff", marginBottom:12 }}>Formas de <em>Pagamento</em></h2>
            <div style={{ width:48, height:2, background:"var(--dourado)", margin:"0 auto" }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:380, margin:"0 auto" }}>
            {[["💚","Pix","Pagamento instantâneo"],["💵","Dinheiro","Reais · Pesos Chilenos · Dólar"],["💳","Cartão de Crédito","Principais bandeiras aceitas"],["🔗","Link de Pagamento","Pague de onde você estiver"],["🌐","Wise","Transferência internacional facilitada"]].map(([ico, title, sub]) => (
              <div key={title as string} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:14, padding:"18px 22px", display:"flex", alignItems:"center", gap:18 }}>
                <div style={{ width:42, height:42, background:"var(--dourado)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{ico}</div>
                <div>
                  <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:13, fontWeight:700, color:"#fff", letterSpacing:0.5, margin:0 }}>{title as string}</p>
                  <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:11, color:"rgba(255,255,255,0.55)", marginTop:2, marginBottom:0 }}>{sub as string}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── RODAPÉ ── */}
        <section className="footer-section">
          <div style={{ width:300, maxWidth:"85%", height:180, margin:"0 auto 28px", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <img src="/catalogo/logos/logo-branca.png" alt="Logo Nevou no Chile" style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14, maxWidth:380, margin:"0 auto 28px" }}>
            {[["📍 Localização","Santiago, Chile"],["🕐 Horário","10h30 às 21h00 · Todos os dias"],["📱 WhatsApp","+55 21 97322-1855"]].map(([label, val]) => (
              <div key={label as string} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.1)", fontSize:13 }}>
                <span style={{ color:"rgba(255,255,255,0.55)" }}>{label as string}</span>
                <span style={{ color:"#fff", fontWeight:600 }}>{val as string}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, lineHeight:1.7, margin:"0 0 20px" }}>
            Nevou no Chile, mas você não precisa passar frio na neve.<br />
            <strong style={{ color:"var(--dourado)" }}>Alugue tudo pronto e viaje tranquilo!</strong>
          </p>
        </section>

      </div>
    </>
  );
}
