import type { Metadata } from "next";
import Link from "next/link";
import { Mic, Send, Star } from "lucide-react";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Artistas — Maré Alta Music",
  description:
    "Apoiamos e impulsionamos talentos angolanos — gravação, produção e lançamento do teu som. Junta-te à Maré Alta Music.",
};

const genres = ["Kizomba", "Semba", "Kuduro", "Afrobeat", "Gospel", "Hip-Hop", "R&B", "Kota"];

const steps = [
  {
    n: "01",
    title: "Contacta-nos",
    desc: "Conta-nos a tua ideia, o teu estilo e o que queres alcançar.",
  },
  {
    n: "02",
    title: "Sessão de estúdio",
    desc: "Gravamos, produzimos e damos forma ao teu projeto.",
  },
  {
    n: "03",
    title: "Lançamento",
    desc: "Masterização, distribuição digital e apoio na divulgação.",
  },
];

export default function ArtistasPage() {
  return (
    <>
      <PageIntro
        kicker="ARTISTAS & TALENTOS"
        title="Apoiamos e impulsionamos"
        accent="o teu talento."
        lead="Se tens som e vontade, nós tratamos do resto — da primeira gravação ao lançamento nas plataformas."
      />

      <section style={{ background: "var(--bg-section)" }}>
        <div
          className="mx-auto w-full max-w-[1236px] px-10"
          style={{ paddingTop: 64, paddingBottom: 72 }}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2
                className="font-display"
                style={{ fontSize: 30, lineHeight: "36px", fontWeight: 800, color: "var(--text)" }}
              >
                Géneros que <span style={{ color: "var(--accent)" }}>produzimos.</span>
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full px-5 py-2 text-[13.5px] font-semibold"
                    style={{
                      border: "1px solid var(--border-card)",
                      background: "var(--bg-card)",
                      color: "var(--text-soft)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
              <div
                className="mt-8 flex items-start gap-4 rounded-[14px] p-6"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <span
                  className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full"
                  style={{ border: "2px solid var(--accent)", color: "var(--accent)" }}
                >
                  <Star size={20} strokeWidth={2} />
                </span>
                <p style={{ fontSize: 15, lineHeight: "23px", color: "var(--text-muted)" }}>
                  Trabalhamos com artistas independentes e bandas — sem letras escondidas.
                  Consulta inicial gratuita para avaliar o teu projeto.
                </p>
              </div>
            </div>

            <div>
              <h2
                className="font-display"
                style={{ fontSize: 30, lineHeight: "36px", fontWeight: 800, color: "var(--text)" }}
              >
                Como <span style={{ color: "var(--accent)" }}>funciona.</span>
              </h2>
              <ol className="mt-6 flex flex-col gap-4">
                {steps.map((s) => (
                  <li
                    key={s.n}
                    className="flex items-start gap-5 rounded-[14px] p-6"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-card)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <span
                      className="font-display shrink-0"
                      style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}
                    >
                      {s.n}
                    </span>
                    <div>
                      <h3
                        className="font-display"
                        style={{ fontSize: 18.5, fontWeight: 700, color: "var(--text)" }}
                      >
                        {s.title}
                      </h3>
                      <p style={{ marginTop: 5, fontSize: 15, lineHeight: "23px", color: "var(--text-muted)" }}>
                        {s.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div
            className="mt-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between"
            style={{
              padding: "26px 30px",
              borderRadius: 14,
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex items-center gap-4">
              <span
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full"
                style={{ border: "2px solid var(--accent)", color: "var(--accent)" }}
              >
                <Mic size={21} strokeWidth={2} />
              </span>
              <p style={{ fontSize: 16.5, lineHeight: "25px", color: "var(--text-soft)" }}>
                Pronto para gravar? <strong style={{ color: "var(--text)" }}>A tua vez de brilhar.</strong>
              </p>
            </div>
            <Link
              href="/contacto"
              className="flex shrink-0 items-center gap-[12px] rounded-full text-[13px] font-semibold text-white"
              style={{ height: 46, paddingInline: 24, background: "var(--accent)" }}
            >
              <Send size={15} strokeWidth={2.4} />
              Fale Conosco
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
