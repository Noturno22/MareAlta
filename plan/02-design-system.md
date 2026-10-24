# 02 — Design System

## Tokens de cor (CSS variables por tema)

| Token | Tema escuro (1.png) | Tema claro (3.png) |
|---|---|---|
| `--bg` | `#0A0C0D` | `#FEFEFE` |
| `--bg-footer` | `#080A0C` | `#FCFCFC` |
| `--bg-card` | `#040607` | `#FFFFFF` |
| `--border-card` | `#1E2023` | `transparent` (sombra `0 1px 3px rgba(0,0,0,.08)`) |
| `--accent` | `#FD5C09` | `#FE4807` |
| `--text` | `#FFFFFF` | `#0A0C0D` |
| `--text-muted` | `#9BA1A6` | `#5A5F63` |
| `--edge` (borda inferior do header) | transparent | `#FEF8EF` |

Aplicação: `:root[data-theme="dark"|"light"]` no `<html>`; Tailwind mapeia via `bg-[var(--bg)]` etc.

## Tipografia

- **Títulos:** Poppins (600/700) — `next/font/google`.
- **Corpo:** Inter (400/500) — `next/font/google`.
- **Script** ("Música é vida!", "JUNTOS…"): **não usado** — está baked nas imagens.

Escala alinhada às refs (viewport 1536):

| Elemento | Tamanho | Peso |
|---|---|---|
| H1 hero | ~54–58px, line-height 1.15 | 700 |
| Kicker hero | ~13px, letter-spacing 0.18em, uppercase | 600 |
| Sub hero | ~17px | 400 |
| Título de secção | ~34px | 700 |
| Título de card | ~17px | 600 |
| Descrição de card | ~14px, line-height 1.55 | 400 |
| Nav | ~14px | 500 |

## Botões

- Primário: fundo `var(--accent)`, texto branco, raio 8px, padding 12×24, peso 600.
- Ghost/outline: borda `rgba(255,255,255,.25)` (escuro) / `rgba(0,0,0,.15)` (claro).
- Hover: escurecer ligeiramente (`brightness(.92)`).

## Espaçamento e layout

- Container: max-width **1440px**, margem lateral **48px** (centrado); nav/logo alinhados ao container.
- Alturas de secção (theme-aware, alvo 1536×1024): header **80** (84 claro) · hero **429** · serviços **282** (268 claro) · CTA **160** (166 claro) · footer **72** (74 claro).
- Cards: 5 colunas — escuro `w 157 / gap 35`; claro `w 195 / gap 12`.
- Raio de cantos: cards 12px, fotos de card 8px, botões 8px.

## Ícones

- lucide-react: `Mic`, `Headphones`, `SlidersHorizontal`, `AudioLines`, `Music4`, `Phone`, `MessageCircle`, `MapPin`, `Sun`, `Moon`.
- Ícone circular do card: stroke laranja dentro de círculo com borda `var(--accent)` (padrão igual nas duas refs).

## Componentes

| Componente | Notas |
|---|---|
| `Header` | logo (crop), nav âncoras, botão laranja, toggle de tema |
| `Hero` | 2 zonas: texto HTML à esquerda, crop de foto à direita (script baked fica na imagem) |
| `Services` | 5 cards; tema escuro = ícone+título+desc; tema claro = ícone+título, foto, desc |
| `CtaBanner` | fundo do tema + slice de foto na posição original + script baked na imagem* + contactos HTML |
| `Footer` | logo, colunas de links, contactos, © 2025 |

\* O script do CTA está baked **fora** dos slices usados; como os slices são posicionais (foto ao centro), o script é **HTML real** na zona branca/clara ou sobre o fundo escuro — see `04-assets.md` §CTA.
