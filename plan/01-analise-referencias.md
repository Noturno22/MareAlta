# 01 — Análise das Referências

Todas as medições foram obtidas por scan de píxeis (PowerShell + System.Drawing) sobre
`img/ref/*.png`, todos **1536×1024**.

## 1. Secções verticais (y)

| Secção | 1.png (escuro) | 3.png (claro) |
|---|---|---|
| Header | 0 – 80 | 0 – 84 |
| Hero | 81 – 509 | 85 – 513 |
| Serviços (cards) | 510 – 791 | 514 – 782 |
| CTA (banda) | 792 – 951 | 783 – 949 |
| Footer | 952 – 1024 | 950 – 1024 |

## 2. Cores exactas

| Elemento | 1.png | 3.png |
|---|---|---|
| Header / fundo principal | `#0A0C0D` | `#FEFEFE` (borda creme `#FEF8EF`) |
| Fundo footer | `#080A0C` | `#FCFCFC` |
| Card | `#040607` (borda `#1E2023`) | `#FFFFFF` (sombra leve) |
| Laranja primário | `#FD5C09` | `#FE4807` |
| Texto principal | `#FFFFFF` | `#0A0C0D` |

## 3. Header (1.png)

- Logo: x 150 – 330, y 5 – 75.
- Nav (centros de item): Início ~637 · Sobre Nós ~709 · Serviços ~811 · Portfólio ~900 · Artistas ~990 · Contacto ~1073.
- Botão laranja: x 1256 – 1404, y ~24 – 56.
- 3.png: logo x 135 – 330; botão x 1211 – 1409; nav a preto.

## 4. Cards de serviço

### 1.png (escuro) — **sem foto**, ícone + título + descrição

- Caixas y 554 – 755 (h ≈ 201), 5 colunas:
  - x: `493–650`, `685–843`, `878–1035`, `1070–1227`, `1262–1420`
  - largura ≈ 157, gap ≈ 35
- Conteúdo: ícone circular laranja (mic, etc.) no topo, título a negrito, descrição a cinza.

### 3.png (claro) — **ícone+título na linha de topo, foto, descrição**

- Caixas y 528 – 782 (h ≈ 254); largura 195, passo 207 (gap ≈ 12):
  - x esquerdas: `431`, `638`, `845`, `1052`, `1259`
- Foto (thumb): y 602 – 694 (h ≈ 93), inset ≈ 18px, largura ≈ 155.

## 5. CTA (banda)

### 1.png (escuro)

- Fundo: foto full-bleed escura (mesa de mistura), texto baked:
  - Script "JUNTOS CRIAMOS GRANDES HISTÓRIAS." ≈ x 159 – 615 (não re-renderizar).
  - Contactos com ífone laranja a partir de x ≈ 1000 (não re-renderizar a faixa da direita inteira — só o slice de foto sem texto vai para a imagem; contactos ficam em HTML).
- **Zona sem texto:** x 620 – 980 (recorte usado).

### 3.png (claro)

- Fundo branco; script baked à esquerda ≈ x 113 – 450.
- Foto central (homem à mesa + botão play baked): x ≈ 460 – 968.
- Contactos à direita a partir de x ≈ 1029 (HTML).
- **Recorte usado:** x 470 – 962 (inclui botão play baked — não re-renderizar).

## 6. Hero

### 1.png (escuro)

- Zona esquerda (x 0 – 615): texto HTML sobre fundo escuro com bokeh (kicker ≈ y 150, H1 ≈ y 175–335, sub ≈ y 355–405, botões ≈ y 425–467).
- Zona direita (x 615 – 1536): foto com script **"Música é vida!"** baked (x ≈ 1355 – 1510) → recorte integra o script; **não** re-renderizar.

### 3.png (claro)

- Zona esquerda: texto HTML sobre estúdio desfocado claro.
- Zona direita (x ≥ 600): foto com hoodie branco e script baked no hoodie (x ≈ 730 – 960).

## 7. Footer (ambos)

- Logo à esquerda (1.png x ≈ 146 – 300; 3.png x ≈ 117 – 330).
- Colunas de links + contactos + copyright; uses reutilizar os logos do header.

## 8. Copy (fonte: `RADME.txt` + leitura das refs)

- Kicker: `PRODUÇÃO MUSICAL • GRAVAÇÃO • MIXAGEM • MASTERIZAÇÃO`
- Headline: `Somos mais que música, somos conexão.`
- 5 serviços: Gravação Profissional, Produção Musical, Mixagem, Masterização, Composição & Arranjos (título/descrição conforme refs/RADME).
- CTA: `JUNTOS CRIAMOS GRANDES HISTÓRIAS.` (baked na imagem) + contactos HTML.
- Contactos: `951 175 720` · `+244 932 932 371` (WhatsApp) · endereço Benfica, Zona Verde III, Rua 9.
- Slogan: `Somos mais que música, somos conexão.` / `Música é vida!` (baked).
