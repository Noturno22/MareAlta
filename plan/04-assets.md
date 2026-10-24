# 04 — Assets

## Extração

Recortes feitos com PowerShell + System.Drawing a partir de `img/ref/*.png`
(script: `C:\Users\Nortuno\AppData\Local\Temp\opencode\extract.ps1`), gravados em **`plan/assets/`**
e copiados para `public/img/` no scaffold. Todos validados visualmente.

## Recortes finais

| Ficheiro | Origem | Caixa (x, y, w, h) | Uso |
|---|---|---|---|
| `hero-dark.png` (921×429) | 1.png | 615, 81, 921, 429 | Hero direito, tema escuro — inclui script baked "Música é vida!" |
| `hero-light.png` (936×429) | 3.png | 600, 85, 936, 429 | Hero direito, tema claro — script baked no hoodie |
| `cta-dark.png` (360×159) | 1.png | 620, 792, 360, 159 | Slice central sem texto do CTA escuro, posicionado a x=620 |
| `cta-light.png` (492×164) | 3.png | 470, 784, 492, 164 | Foto central do CTA claro (botão play baked), posicionada a x=470 |
| `logo-dark.png` (195×78) | 1.png | 145, 3, 195, 78 | Logo header/footer escuro (fundo `#0A0C0D`) |
| `logo-light.png` (210×80) | 3.png | 130, 3, 210, 80 | Logo header/footer claro (fundo `#FEFEFE`) |
| `card-1.png` (155×93) | 3.png | 449, 602 | Gravação — mic |
| `card-2.png` (155×93) | 3.png | 656, 602 | Produção — controladora |
| `card-3.png` (155×93) | 3.png | 863, 602 | Mixagem — mesa |
| `card-4.png` (155×93) | 3.png | 1070, 602 | Masterização/Vídeo — câmara |
| `card-5.png` (155×93) | 3.png | 1277, 602 | Live/Artistas — concerto |

Fotos dos cards servem **só o tema claro** (cards escuros 1.png não têm foto — só ícone+título+desc).

## Posicionamento no layout

- **Hero:** zona esquerda = texto HTML sobre cor/glow do tema; crop encostado à direita (x 615 escuro / 600 claro), com gradiente de fusão na sua borda esquerda (~80px).
- **CTA escuro:** fundo `#06070A` + gradiente + `cta-dark.png` em `background-position: 620px` (tamanho natural, sem esticar); script "JUNTOS…" e contactos em HTML.
- **CTA claro:** fundo branco + `cta-light.png` a x=470 (natural); script e contactos em HTML.
- **Play button** do CTA claro e **script dos heroes**: baked — nunca re-renderizar.

## Fallbacks (em `img/`, cópia para `public/`)

- `img/banner.jpg` (1600×666) — substituto de hero se o crop falhar.
- `img/pub/*.jpg` — 5 imagens de conteúdo para portfolio/serviços.
- `img/logo.jpg` (1024×1024, fundo branco) — **não usar** no tema escuro (borda branca visível); usar só se necessário no claro.

## Regras

1. Nunca colocar texto HTML por cima de texto baked (causa duplicação no QA).
2. Nunca esticar crops (`background-size: auto` / `object-fit: cover` só em zonas sem texto).
3. Se um crop falhar no QA visual, re-extrair com caixa ajustada e actualizar a tabela acima.
