import type { Metadata } from "next";
import Link from "next/link";
import { AudioWaveform, Mic, Music, Send, SlidersVertical, Star, Video } from "lucide-react";
import PageIntro from "@/components/PageIntro";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Serviços — Maré Alta Music",
  description:
    "Gravação profissional, mixagem e masterização, produção musical, videoclipes e apoio a artistas — em Benguela, Angola.",
};

const icons = { mic: Mic, sliders: SlidersVertical, music: Music, video: Video, star: Star };

const details: Record<string, string> = {
  "Gravação\nProfissional":
    "Captação vocal e instrumental em ambiente controlado, com pré-amplificadores e microfones de estúdio. Direction, comping e edições incluídas.",
  "Mixagem\ne Masterização":
    "Balanceamento, efeitos, automações e loudness de entrega nas plataformas digitais (Spotify, YouTube, Apple Music).",
  "Produção\nMusical":
    "Beat making, arranjos, composição e sound design — do esboço à instrumental final pronta para gravar.",
  "Videoclipes":
    "Conceito, gravação, direção e pós-produção de vídeos impactantes para lançamentos e conteúdo de redes sociais.",
  "Artistas &\nTalentos":
    "Mentoria artística, desenvolvimento de projeto, plano de lançamento e distribuição digital do seu catálogo.",
};

export default function ServicosPage() {
  return (
    <>
      <PageIntro
        kicker="OS NOSSOS SERVIÇOS"
        title="Da ideia ao"
        accent="grande som."
        lead="Soluções completas para artistas, bandas e criadores de conteúdo — desde a gravação até à distribuição."
      />

      <section style={{ background: "var(--bg-section)" }}>
        <div
          className="mx-auto w-full max-w-[1236px] px-10"
          style={{ paddingTop: 64, paddingBottom: 48 }}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((s) => {
              const Icon = icons[s.icon as keyof typeof icons];
              return (
                <article
                  key={s.title}
                  className="flex flex-col rounded-[14px] p-7"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <span
                    className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
                    style={{ border: "2px solid var(--accent)", color: "var(--accent)" }}
                  >
                    <Icon size={24} strokeWidth={2} />
                  </span>
                  <h2
                    className="font-display whitespace-pre-line"
                    style={{ marginTop: 18, fontSize: 21, lineHeight: "26px", fontWeight: 700, color: "var(--text)" }}
                  >
                    {s.title}
                  </h2>
                  <p
                    className="whitespace-pre-line"
                    style={{ marginTop: 10, fontSize: 15, lineHeight: "23px", color: "var(--text-muted)" }}
                  >
                    {s.desc}
                  </p>
                  <p
                    style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: "1px solid var(--border-card)",
                      fontSize: 14,
                      lineHeight: "22px",
                      color: "var(--text-soft)",
                    }}
                  >
                    {details[s.title]}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="mx-auto flex w-full max-w-[1236px] flex-col items-start gap-5 px-10 md:flex-row md:items-center md:justify-between"
          style={{ paddingBottom: 72 }}
        >
          <div className="flex items-center gap-3" style={{ color: "var(--text-soft)" }}>
            <AudioWaveform size={26} strokeWidth={2.2} style={{ color: "var(--accent)" }} />
            <p style={{ fontSize: 16, lineHeight: "24px" }}>
              Não sabes qual é o serviço certo para ti? <strong>Fale connosco.</strong>
            </p>
          </div>
          <Link
            href="/contacto"
            className="flex items-center gap-[12px] rounded-full text-[13px] font-semibold text-white"
            style={{ height: 46, paddingInline: 24, background: "var(--accent)" }}
          >
            <Send size={15} strokeWidth={2.4} />
            Fale Conosco
          </Link>
        </div>
      </section>
    </>
  );
}
