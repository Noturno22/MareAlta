import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Sobre Nós — Maré Alta Music",
  description:
    "Conheça a Maré Alta Music: estúdio de produção musical em Benguela, Angola. Gravação, mixagem, masterização e apoio a artistas.",
};

const stats = [
  { n: "100+", label: "Produções realizadas" },
  { n: "5", label: "Serviços completos" },
  { n: "24h", label: "Resposta rápida no WhatsApp" },
  { n: "1", label: "Missão: som e conexão" },
];

const values = [
  {
    title: "Qualidade",
    desc: "Tecnologia de áudio profissional em cada etapa, da gravação à masterização final.",
  },
  {
    title: "Criatividade",
    desc: "Cada projeto é único — damos espaço à sua identidade e ajudamos a encontrá-la.",
  },
  {
    title: "Conexão",
    desc: "Trabalhamos lado a lado com artistas, bandas e criadores de conteúdo.",
  },
];

export default function SobrePage() {
  return (
    <>
      <PageIntro
        kicker="SOBRE NÓS"
        title="Somos mais que música,"
        accent="somos conexão."
        lead="A Maré Alta Music é um estúdio angolano dedicado a transformar ideias em produções de alto nível, em Benguela e para o mundo."
      />

      <section style={{ background: "var(--bg-section)" }}>
        <div
          className="mx-auto grid w-full max-w-[1236px] grid-cols-1 gap-12 px-10"
          style={{ paddingTop: 64, paddingBottom: 64 }}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2
                className="font-display"
                style={{ fontSize: 34, lineHeight: "40px", fontWeight: 800, color: "var(--text)" }}
              >
                A nossa <span style={{ color: "var(--accent)" }}>história.</span>
              </h2>
              <p
                style={{
                  marginTop: 18,
                  fontSize: 16.5,
                  lineHeight: "27px",
                  color: "var(--text-soft)",
                }}
              >
                Nascemos em Benguela, na Zona Verde III, com uma ideia simples: provar que
                produção musical de excelência pode ser feita em Angola. Começámos por gravar
                amigos e bandas locais e crescemos até nos tornarmos uma equipa completa de
                produção.
              </p>
              <p
                style={{
                  marginTop: 16,
                  fontSize: 16.5,
                  lineHeight: "27px",
                  color: "var(--text-soft)",
                }}
              >
                Hoje acompanhamos artistas desde a primeira demo até ao lançamento final —
                gravação, composição, mixagem, masterização e videoclipes — com o mesmo
                cuidado em cada projeto.
              </p>
            </div>

            <div
              className="flex flex-col justify-center rounded-[14px] p-8"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <p
                className="font-display"
                style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent)" }}
              >
                A NOSSA MISSÃO
              </p>
              <p
                className="font-display"
                style={{ marginTop: 14, fontSize: 24, lineHeight: "32px", fontWeight: 700, color: "var(--text)" }}
              >
                Dar voz às ideias e transformá-las em som profissional.
              </p>
              <p style={{ marginTop: 14, fontSize: 15, lineHeight: "23px", color: "var(--text-muted)" }}>
                Benfica, Zona Verde III, Rua 9 — Benguela, Angola.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[14px] p-6"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p
                  className="font-display"
                  style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)" }}
                >
                  {s.n}
                </p>
                <p style={{ marginTop: 6, fontSize: 14, lineHeight: "20px", color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-[14px] p-7"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <span
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-[20px]"
                  style={{ border: "2px solid var(--accent)", color: "var(--accent)" }}
                >
                  •
                </span>
                <h3
                  className="font-display"
                  style={{ marginTop: 16, fontSize: 20, fontWeight: 700, color: "var(--text)" }}
                >
                  {v.title}
                </h3>
                <p style={{ marginTop: 8, fontSize: 15, lineHeight: "23px", color: "var(--text-muted)" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
