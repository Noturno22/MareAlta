"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "./theme";

const SLIDES = [
  {
    src: "/carrocel/1.jpeg",
    kicker: "Maré Alta Music",
    title: ["Somos mais que", "música,", "somos conexão."],
    subtitle: "Transformamos ideias em grandes produções.",
  },
  {
    src: "/carrocel/2.jpeg",
    kicker: "Bem-vindo à Maré Alta Music",
    title: ["Gravação", "Profissional"],
    subtitle: "Estúdio com qualidade premium para o teu projeto.",
  },
  {
    src: "/carrocel/3.jpeg",
    kicker: "Produção & Mixagem",
    title: ["Mistura &", "Mastering"],
    subtitle: "Som limpo, equilibrado e pronto para streaming.",
  },
];

export default function Carousel() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: 520, background: "var(--bg)" }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1536px]">
        {SLIDES.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={i === 0}
            draggable={false}
            className="absolute inset-0 select-none object-cover object-center transition-opacity duration-[1000ms] ease-in-out"
            style={{ opacity: index === i ? 1 : 0 }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            background: dark
              ? "linear-gradient(90deg, rgba(5,4,5,0.92) 0%, rgba(5,4,5,0.6) 42%, rgba(5,4,5,0.28) 72%, rgba(5,4,5,0.16) 100%)"
              : "linear-gradient(90deg, rgba(246,246,246,0.94) 0%, rgba(246,246,246,0.64) 42%, rgba(246,246,246,0.3) 72%, rgba(246,246,246,0.18) 100%)",
          }}
        />
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute transition-all duration-[1000ms] ease-in-out"
            style={{
              left: "clamp(1rem, 8vw, 150px)",
              top: "50%",
              transform: `translateY(-50%) translateX(${index === i ? 0 : -30}px)`,
              opacity: index === i ? 1 : 0,
              pointerEvents: index === i ? "auto" : "none",
              maxWidth: "min(90vw, 560px)",
            }}
          >
            <p
              className="font-display text-[11px] font-semibold uppercase sm:text-[12px] lg:text-[13px]"
              style={{
                letterSpacing: "0.16em",
                color: "var(--accent)",
              }}
            >
              {slide.kicker}
            </p>
            <h3
              className="font-display mt-3 text-[36px] leading-[38px] font-bold sm:mt-4 sm:text-[48px] sm:leading-[50px] lg:mt-4 lg:text-[56px] lg:leading-[56px]"
              style={{
                color: "var(--text)",
              }}
            >
              {slide.title.map((line, idx) => (
                <span key={idx}>
                  {idx === 1 ? <span style={{ color: "var(--accent)" }}>{line}</span> : line}
                  {idx < slide.title.length - 1 && <br />}
                </span>
              ))}
            </h3>
            <p
              className="mt-4 text-[15px] leading-[22px] sm:mt-5 sm:text-[16px] sm:leading-[24px] lg:mt-6 lg:text-[17.5px] lg:leading-[26px]"
              style={{
                color: "var(--text)",
              }}
            >
              {slide.subtitle}
            </p>
          </div>
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir para slide ${i + 1}`}
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
