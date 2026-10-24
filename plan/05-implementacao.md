# 05 — Implementação e QA

## Passos

1. **Scaffold** na raiz `Mare/`:
   `npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --yes`
   + `npm i lucide-react`.
   Copiar `plan/assets/*` → `public/img/` e `img/banner.jpg`, `img/pub/*` → `public/img/`.
2. **Tokens**: `globals.css` com variáveis por `data-theme`; fonts Poppins+Inter no `layout.tsx`; script anti-flash de tema.
3. **Conteúdo**: `lib/content.ts` com nav, 5 serviços (título+desc das refs), contactos (`RADME.txt`).
4. **Componentes** (nesta ordem): `Header` → `Hero` → `Services` → `CtaBanner` → `Footer` → `page.tsx`.
5. **Ajuste de alturas/posições** para bater 1024px totais às 1536 de largura (ver tabela em `01-analise-referencias.md` §1).
6. **QA** (protocolo abaixo), corrigir, repetir.

## Protocolo de QA

1. `npm run dev` (porta 3000).
2. Screenshot **1536×1024** da página inteira (tema escuro) → comparar com `img/ref/1.png`.
3. Alternar tema → screenshot → comparar com `img/ref/3.png`.
4. Ferramenta: browser skill (bsk) ou Playwright headless; para diff, gerar imagem de diferença (System.Drawing: `Abs(r1-r2) > 24` → vermelho) ou sobreposição 50%.
5. Checklist por secção:
   - [ ] Header: logo, 6 itens de nav, botão laranja, toggle — mesmas posições (±8px).
   - [ ] Hero: kicker, H1 (2 linhas), sub, 2 botões; crop encostado à direita sem gap; script baked visível e único.
   - [ ] Serviços: 5 cards, títulos correctos; tema claro com fotos; sem texto duplicado.
   - [ ] CTA: slice na posição certa, script único, contactos correctos.
   - [ ] Footer: logo, colunas, © 2025.
   - [ ] Sem scroll horizontal; altura total ≈ 1024 a 1536 de largura.
6. Corrigir medições no código (não nas refs) e repetir até diff aceitável.

## Critério de aceitação

Screenshot 1536×1024 por tema **sem diferenças estruturais** visíveis vs 1.png/3.png:
posições de texto, caixas de card, cores e imagens alinhadas; apenas anti-aliasing/foto-compressão podem diferir.
