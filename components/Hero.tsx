"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Headphones, Play } from "lucide-react";
import { hero } from "@/lib/content";
import { useTheme } from "./theme";

const HERO_SLIDES = [
  {
    kicker: hero.kicker,
    title: ["Somos mais que", "música,", "somos conexão."],
    sub1: hero.sub1,
    sub2a: hero.sub2a,
    sub2b: hero.sub2b,
  },
  {
    kicker: "Bem-vindo à Maré Alta Music",
    title: ["Transformamos", "ideias", "em grandes produções."],
    sub1: "Gravação, produção, mistura e",
    sub2a: "mastering com ",
    sub2b: "qualidade profissional.",
  },
  {
    kicker: "Estúdio Profissional",
    title: ["Gravação", "& Produção"],
    sub1: "Captação limpa, direcional e",
    sub2a: "com o ambiente ideal para ",
    sub2b: "cada artista.",
  },
  {
    kicker: "Som Pronto para o Mundo",
    title: ["Mistura", "& Mastering"],
    sub1: "Equilíbrio, impacto e clareza",
    sub2a: "prontos para todas as ",
    sub2b: "plataformas.",
  },
  {
    kicker: "Música com Identidade",
    title: ["Criação", "com alma"],
    sub1: "Do primeiro acorde à versão final,",
    sub2a: "cuidamos de cada ",
    sub2b: "detalhe.",
  },
  {
    kicker: "Para Artistas e Projetos",
    title: ["Da ideia", "ao lançamento"],
    sub1: "Acompanhamento completo do teu",
    sub2a: "projeto com ",
    sub2b: "resultados reais.",
  },
];

export default function Hero() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[var(--bg)]"
      style={{ minHeight: "clamp(380px, 45vw, 429px)" }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1536px] px-4 sm:px-6 lg:px-10">
        {HERO_SLIDES.map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1000ms] ease-in-out"
            style={{ opacity: index === i ? 1 : 0 }}
          >
            <Image
              src={dark ? "/img/hero-dark-left.png" : "/img/hero-light-left.png"}
              alt=""
              fill
              priority={i === 0}
              draggable={false}
              className="hidden select-none object-contain object-left lg:block"
            />
            <Image
              src={dark ? "/img/hero-dark.png" : "/img/hero-light.png"}
              alt=""
              fill
              priority={i === 0}
              draggable={false}
              className="hidden select-none object-contain object-right lg:block"
            />
            <div className="absolute inset-0 lg:hidden">
              <Image
                src={dark ? "/img/hero-dark.png" : "/img/hero-light.png"}
                alt=""
                fill
                priority={i === 0}
                draggable={false}
                className="select-none object-cover object-right"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: dark
                    ? "linear-gradient(90deg, rgba(10,12,13,0.98) 0%, rgba(10,12,13,0.92) 40%, rgba(10,12,13,0.6) 70%, rgba(10,12,13,0.3) 100%)"
                    : "linear-gradient(90deg, rgba(254,254,254,0.98) 0%, rgba(254,254,254,0.94) 38%, rgba(254,254,254,0.7) 70%, rgba(254,254,254,0.4) 100%)",
                }}
              />
            </div>
          </div>
        ))}

        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="relative z-10 flex min-h-[clamp(380px,45vw,429px)] flex-col justify-center transition-all duration-[1000ms] ease-in-out"
            style={{
              opacity: index === i ? 1 : 0,
              transform: `translateX(${index === i ? 0 : -20}px)`,
              pointerEvents: index === i ? "auto" : "none",
              position: index === i ? "relative" : "absolute",
              inset: index === i ? undefined : "0",
              paddingLeft: "clamp(1rem, 8vw, 150px)",
            }}
          >
            <p
              className="font-display whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.15em] sm:text-[12px] lg:text-[13px]"
              style={{ color: "var(--accent)", letterSpacing: dark ? "0.15em" : "0.16em" }}
            >
              {slide.kicker}
            </p>

            <h1
              className="font-display mt-3 text-[38px] leading-[38px] font-bold sm:mt-4 sm:text-[48px] sm:leading-[48px] lg:mt-5 lg:text-[62px] lg:leading-[58.5px]"
              style={{ color: "var(--text)" }}
            >
              {slide.title[0]}
              <br />
              <span style={{ color: "var(--accent)" }}>{slide.title[1]}</span>
              <br />
              {slide.title[2]}
            </h1>

            <p
              className="mt-4 max-w-[320px] text-[15px] leading-[22px] sm:mt-5 sm:max-w-[380px] sm:text-[16px] sm:leading-[24px] lg:mt-6 lg:max-w-none lg:text-[17.5px] lg:leading-[26px]"
              style={{ color: "var(--text)" }}
            >
              {slide.sub1}
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              {slide.sub2a}
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>{slide.sub2b}</span>
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-4 lg:mt-9 lg:gap-[18px]">
              <Link
                href="/servicos"
                className="flex items-center rounded-full text-white"
                style={{
                  background: "var(--accent)",
                  height: dark ? 42 : 54,
                  gap: dark ? 12 : 10,
                  padding: dark ? "0 23px" : "0 16px",
                  fontSize: dark ? 12.75 : 15.5,
                  fontWeight: 600,
                }}
              >
                <span
                  className="flex shrink-0 items-center justify-center rounded-full bg-white"
                  style={{ width: dark ? 16 : 30, height: dark ? 16 : 30 }}
                >
                  <Play size={dark ? 7 : 13} fill="var(--accent)" color="var(--accent)" />
                </span>
                {dark ? hero.primary.dark : hero.primary.light}
              </Link>
              <Link
                href="/portfolio"
                className="flex items-center rounded-full"
                style={{
                  height: dark ? 42 : 54,
                  gap: dark ? 12 : 8,
                  padding: dark ? "0 21px" : "0 16px",
                  fontSize: dark ? 11 : 15.5,
                  fontWeight: 600,
                  color: "var(--text)",
                  ...(dark
                    ? {
                        border: "2px solid transparent",
                        background:
                          "linear-gradient(#050405,#050405) padding-box, linear-gradient(to right, #ca4608 0%, #e1e2e4 73%) border-box",
                      }
                    : { border: "1px solid rgba(15,23,42,.22)" }),
                }}
              >
                {dark ? (
                  <svg width={17} height={17} viewBox="0 0 24 24" aria-hidden className="shrink-0">
                    <circle cx="12" cy="12" r="10" fill="#fff" />
                    <circle cx="12" cy="12" r="3" fill="#050405" />
                    <circle cx="19.4" cy="4.9" r="1.8" fill="#050405" />
                  </svg>
                ) : (
                  <Headphones size={17} />
                )}
                {hero.secondary}
              </Link>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para slide hero ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: index === i ? 28 : 8,
                background: index === i ? "var(--accent)" : "var(--text)",
                opacity: index === i ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
