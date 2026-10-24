import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "Portfólio — Maré Alta Music",
  description:
    "Trabalhos, sessões e produções da Maré Alta Music — estúdio em Benguela, Angola.",
};

const works = [
  { img: "/img/2n.jpg", title: "Sessão de Estúdio", tag: "Gravação" },
  { img: "/img/3.jpg", title: "Produção Musical", tag: "Produção" },
  { img: "/img/4.jpg", title: "Mixagem & Master", tag: "Pós" },
  { img: "/img/5.jpg", title: "Videoclipe", tag: "Vídeo" },
  { img: "/img/pub 1.jpg", title: "Bastidores", tag: "Estúdio" },
  { img: "/img/banner.jpg", title: "Maré Alta Sessions", tag: "Live" },
];

export default function PortfolioPage() {
  return (
    <>
      <PageIntro
        kicker="PORTFÓLIO"
        title="Juntos criamos"
        accent="grandes histórias."
        lead="Uma seleção de trabalhos, sessões e produções realizadas no nosso estúdio."
      />

      <section style={{ background: "var(--bg-section)" }}>
        <div
          className="mx-auto w-full max-w-[1236px] px-10"
          style={{ paddingTop: 64, paddingBottom: 72 }}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => (
              <figure
                key={w.title}
                className="overflow-hidden rounded-[14px]"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={w.img}
                    alt={w.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
                <figcaption className="flex items-center justify-between px-5 py-4">
                  <span
                    className="font-display"
                    style={{ fontSize: 16.5, fontWeight: 700, color: "var(--text)" }}
                  >
                    {w.title}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "var(--accent)",
                    }}
                  >
                    {w.tag.toUpperCase()}
                  </span>
                </figcaption>
              </figure>
            ))}
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
            <p style={{ fontSize: 16.5, lineHeight: "25px", color: "var(--text-soft)" }}>
              Queres ver o teu projeto aqui? <strong style={{ color: "var(--text)" }}>Vamos trabalhar juntos.</strong>
            </p>
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
