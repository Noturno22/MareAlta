# 03 — Estrutura do Projecto

## Stack

- **Next.js 15** (App Router, JavaScript/TypeScript) + **Tailwind CSS 4**
- **lucide-react** (ícones), **next/font/google** (Poppins + Inter)
- Sem backend: site estático one-page.

## Árvore

```
Mare/
├── app/
│   ├── layout.tsx          # fonts, data-theme, meta
│   ├── page.tsx            # one-page: Header + Hero + Services + CTA + Footer
│   └── globals.css         # tokens CSS por tema, utilitários
├── components/
│   ├── Header.tsx          # logo, nav âncoras, botão, ThemeToggle
│   ├── Hero.tsx            # texto HTML + <Image> hero-{theme}
│   ├── Services.tsx        # 5 cards (estrutura varia por tema)
│   ├── CtaBanner.tsx       # slice posicional + contactos HTML
│   └── Footer.tsx          # logo, links, contactos, ©
├── lib/
│   ├── content.ts          # copy: serviços, contactos, nav
│   └── theme.ts            # toggle (script inline, sem flash)
├── public/
│   └── img/                # assets copiados de plan/assets + fallbacks (banner.jpg, pub/)
├── plan/                   # documentação (não faz parte do bundle)
└── package.json
```

## Âncoras

| Âncora | Secção |
|---|---|
| `#inicio` | Hero |
| `#servicos` | Cards de serviço |
| `#portfolio` | Banda CTA (fotos dos trabalhos) |
| `#contactos` | Contactos do CTA + footer |

Nav conforme refs: `Início · Sobre Nós · Serviços · Portfólio · Artistas · Contacto`
— `Sobre Nós` e `Artistas` apontam a âncoras internas (hero/serviços) por não existirem secções próprias nas refs base (1.png/3.png).

## Tema

- `<html data-theme="dark">` por omissão; inline script no `layout` lê `localStorage.theme` antes da hidratação (sem flash).
- Toggle no `Header` altera `data-theme`; imagens e cores trocam por variáveis/condições de componente.

## Responsivo (fora do alvo de QA, mas incluído)

- < 1024px: nav vira menu hambúrguer; cards 5 → 2 colunas → 1 coluna; hero empilha (foto vira fundo).
