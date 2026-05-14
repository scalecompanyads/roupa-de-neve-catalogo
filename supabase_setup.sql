-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT,
    tone TEXT,
    order_index INTEGER DEFAULT 0
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subtitle TEXT,
    price TEXT,
    clp_price TEXT,
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    colors TEXT[] DEFAULT '{}'::text[]
);

-- Criar tabela de imagens de produto
CREATE TABLE IF NOT EXISTS public.product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    color TEXT,
    is_cover BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0
);

-- Configurar RLS (Row Level Security) para permitir leitura pública
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Leitura pública de produtos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Leitura pública de imagens" ON public.product_images FOR SELECT USING (true);

-- Permitir TODAS as operações (CRUD) para usuários anônimos temporariamente (ou autenticados se você já tiver login)
-- Aviso: Se você usar a anon_key para atualizar no admin, você precisa dessa política:
CREATE POLICY "Admin All Access Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access Images" ON public.product_images FOR ALL USING (true) WITH CHECK (true);

-- Criar bucket de storage para as imagens se não existir
INSERT INTO storage.buckets (id, name, public) VALUES ('catalogo', 'catalogo', true) ON CONFLICT DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Leitura publica storage" ON storage.objects FOR SELECT USING (bucket_id = 'catalogo');
CREATE POLICY "Upload publico storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'catalogo');
CREATE POLICY "Update publico storage" ON storage.objects FOR UPDATE USING (bucket_id = 'catalogo');
CREATE POLICY "Delete publico storage" ON storage.objects FOR DELETE USING (bucket_id = 'catalogo');
