"use client";

import Image from "next/image";
import { AudioWaveform, Mic, Music, SlidersVertical, Star, Video } from "lucide-react";
import { services, servicesIntro } from "@/lib/content";
import { useTheme } from "./theme";

const icons = { mic: Mic, sliders: SlidersVertical, music: Music, video: Video, star: Star };

export default function Services() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const L = dark ? 152 : 66;

  return (
    <section
      id="servicos"
      className="relative overflow-hidden"
      style={{ height: dark ? 312 : 298, background: "var(--bg-section)" }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1536px]">
        <Image
          src={dark ? "/img/svc-deco-dark.png" : "/img/svc-deco-light.png"}
          alt=""
          width={dark ? 154 : 66}
          height={dark ? 150 : 268}
          draggable={false}
          className="absolute top-0 left-0 select-none"
        />

        <p
          className="font-display absolute whitespace-nowrap"
          style={{
            left: L,
            top: dark ? 31 : 53,
            fontSize: dark ? 12 : 13,
            fontWeight: 600,
            letterSpacing: dark ? "0.1em" : "0.16em",
            color: "var(--accent)",
          }}
        >
          {servicesIntro.kicker}
        </p>

        <h2
          className="font-display absolute"
          style={{
            left: L,
            top: dark ? 58 : 62,
            fontSize: dark ? 46 : 44,
            lineHeight: dark ? "43px" : "50px",
            fontWeight: 800,
            color: "var(--text)",
          }}
        >
          {servicesIntro.title1}
          <br />
          <span
            style={{
              color: "var(--accent)",
              fontWeight: dark ? 900 : undefined,
              letterSpacing: dark ? "0.024em" : undefined,
            }}
          >
            {servicesIntro.title2}
          </span>
        </h2>

        <p
          className="absolute"
          style={{
            left: L,
            top: dark ? 155 : 181,
            width: dark ? 256 : 342,
            fontSize: dark ? 13 : 16.5,
            lineHeight: dark ? "19px" : "21.5px",
            fontWeight: 400,
            color: "var(--text)",
          }}
        >
          {servicesIntro.para}
        </p>

        <div
          className="absolute flex items-center"
          style={{ left: L, top: dark ? 226 : 254, gap: dark ? 15 : 9 }}
        >
          {dark ? (
            <svg
              width={34}
              height={34}
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent)"
              strokeWidth={2}
              strokeLinecap="round"
              className="shrink-0"
              aria-hidden
              style={{ transform: "translateY(1px)" }}
            >
              <path d="M2 10v4" />
              <path d="M6.5 5v14" />
              <path d="M11 2v20" />
              <path d="M15.5 5v14" />
              <path d="M20 10v4" />
            </svg>
          ) : (
            <AudioWaveform size={26} strokeWidth={2.2} className="shrink-0" style={{ color: "var(--accent)" }} />
          )}
          <p
            style={{
              fontSize: dark ? 11.5 : 14,
              lineHeight: "17px",
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            {servicesIntro.note1}
            <br />
            {servicesIntro.note2}
          </p>
        </div>

        <ul
          className="absolute flex"
          style={{ left: dark ? 483 : 431, top: dark ? 45 : 14, gap: dark ? 16 : 12 }}
        >
          {services.map((s) => {
            const Icon = icons[s.icon as keyof typeof icons];
            return dark ? (
              <li
                key={s.title}
                className="relative shrink-0"
                style={{
                  width: 176,
                  height: 202,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: 12,
                }}
              >
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    left: 18,
                    top: 17,
                    width: 52,
                    height: 52,
                    border: "2px solid var(--accent)",
                  }}
                >
                  <Icon size={24} strokeWidth={2} style={{ color: "var(--accent)" }} />
                </span>
                <h3
                  className="absolute whitespace-pre-line"
                  style={{
                    left: 19,
                    top: 80,
                    right: 13,
                    fontSize: 15,
                    lineHeight: "19px",
                    fontWeight: 700,
                    letterSpacing: s.titleLsDark,
                    color: "var(--text)",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="absolute whitespace-pre-line"
                  style={{
                    left: 18,
                    top: s.title.includes("\n") ? 126 : 118,
                    right: s.descRight ?? 13,
                    fontSize: dark ? 11.25 : 13.5,
                    lineHeight: dark ? "19.5px" : "18px",
                    fontWeight: 400,
                    letterSpacing: s.descLsDark,
                    color: dark ? "#c6d1df" : "var(--text-muted)",
                  }}
                >
                  {s.desc}
                </p>
              </li>
            ) : (
              <li
                key={s.title}
                className="relative shrink-0"
                style={{
                  width: 195,
                  height: 254,
                  background: "var(--bg-card)",
                  borderRadius: 14,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    left: 14,
                    top: 14,
                    width: 40,
                    height: 40,
                    border: "2px solid var(--accent)",
                  }}
                >
                  <Icon size={18} strokeWidth={2} style={{ color: "var(--accent)" }} />
                </span>
                <h3
                  className="absolute whitespace-pre-line"
                  style={{
                    left: 66,
                    top: 16,
                    right: 10,
                    fontSize: 15.5,
                    lineHeight: "19px",
                    fontWeight: 700,
                    color: "var(--text)",
                  }}
                >
                  {s.title}
                </h3>
                <Image
                  src={s.img}
                  alt=""
                  width={155}
                  height={93}
                  draggable={false}
                  className="absolute rounded-[8px] object-cover select-none"
                  style={{ left: 18, top: 74, width: 155, height: 93 }}
                />
                <p
                  className="absolute whitespace-pre-line"
                  style={{
                    left: 16,
                    top: 180,
                    right: 14,
                    fontSize: 13.5,
                    lineHeight: "20px",
                    fontWeight: 400,
                    color: "var(--text-muted)",
                  }}
                >
                  {s.desc}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
