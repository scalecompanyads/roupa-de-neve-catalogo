# Catálogo Nevou no Chile

Aplicação Next.js para manter o catálogo visual igual ao HTML original, mas com produtos editáveis no painel `/admin`.

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse:

- Catálogo: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

## Conectar Supabase

1. Crie um projeto no Supabase.
2. Rode o SQL de `supabase/schema.sql` no SQL Editor.
3. Crie `.env.local` a partir de `.env.local.example`.
4. Preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=catalogo
```

Sem `.env.local`, o painel salva no navegador para você testar a edição imediatamente.
