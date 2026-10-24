# Plano — Réplica do Site Maré Alta Music

## Objectivo

Replicar exactamente o site da **Maré Alta Music** (one-page com âncoras) a partir de 3 mockups de referência, construído em **Next.js + Tailwind CSS**, com QA visual por comparação de screenshots 1536×1024 contra as referências.

## Referências

| Ficheiro | Tema | Uso |
|---|---|---|
| `img/ref/1.png` | Escuro | **Base principal** — estrutura, cores, copy |
| `img/ref/2.png` | Escuro (variante) | Descartado como base (6 serviços + "Sobre Nós" divergem) |
| `img/ref/3.png` | Claro | **Base do tema claro** — mesmo layout, tema claro |

## Decisões (confirmadas)

- **Stack:** Next.js (App Router) + Tailwind CSS + lucide-react (ícones) + SVG inline (marca).
- **Páginas:** uma só (one-page) com navegação por âncoras: `#inicio`, `#servicos`, `#portfolio`, `#contactos`.
- **Temas:** escuro (1.png, por omissão) + claro (3.png), com toggle no header.
- **Imagens:** extraídas por recorte (crop) dos próprios PNGs de referência — ver `04-assets.md`.
- **Texto baked nas refs:** tudo o que é texto decorativo gravado na imagem (script "Música é vida!", "JUNTOS CRIAMOS GRANDES HISTÓRIAS", botão play) fica **na imagem** e não é re-renderizado; todo o resto (nav, headline, serviços, contactos) é HTML real.
- **Localização:** endereço real da marca (`RADME.txt`) substitui "Benguela, Angola" das refs: *Benfica, Zona Verde III, Rua 9 — depois do Arreiou, na terceira travessa*.
- **© 2025** mantido conforme as refs.

## Índice

| Documento | Conteúdo |
|---|---|
| [`01-analise-referencias.md`](01-analise-referencias.md) | Medições por píxel: secções, caixas, cores exactas |
| [`02-design-system.md`](02-design-system.md) | Tokens: cores, tipografia, espaçamentos, componentes |
| [`03-estrutura.md`](03-estrutura.md) | Estrutura do projecto Next.js, secções, âncoras |
| [`04-assets.md`](04-assets.md) | Inventário de imagens: caixas de recorte finais e fallbacks |
| [`05-implementacao.md`](05-implementacao.md) | Passos de implementação + protocolo de QA |

## Estado

- [x] Análise das 3 referências e medições
- [x] Recortes extraídos para `plan/assets/` (11 ficheiros, validados visualmente)
- [x] Documentação do plano (`plan/`)
- [ ] Scaffold Next.js
- [ ] Implementação dos componentes
- [ ] QA visual (screenshot 1536×1024 vs refs)
