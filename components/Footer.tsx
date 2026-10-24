"use client";

import Image from "next/image";
import { footer } from "@/lib/content";
import { useTheme } from "./theme";

export default function Footer() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <footer
      className="relative"
      style={{ height: dark ? 72 : 74, background: "var(--bg-footer)" }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1536px]">
        <Image
          src={dark ? "/img/logo-n-dark.png" : "/img/logo-n.png"}
          alt="Maré Alta Music"
          width={dark ? 63 : 91}
          height={dark ? 44 : 64}
          draggable={false}
          className="absolute select-none"
          style={{
            left: dark ? 144 : 117,
            top: dark ? 14 : "50%",
            transform: dark ? "none" : "translateY(-50%)",
            width: dark ? 63 : 91,
            height: dark ? 44 : 64,
          }}
        />

        <span
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            left: dark ? 330 : 357,
            width: 1,
            height: 44,
            display: dark ? "none" : "block",
            background: dark ? "rgba(255,255,255,.12)" : "rgba(15,23,42,.12)",
          }}
        />

        <p
          className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
          style={{
            left: dark ? 375 : 397,
            fontSize: dark ? 9.05 : 12.5,
            fontWeight: 400,
            marginTop: dark ? -2 : 0,
            color: dark ? "#e1ecf6" : "var(--text-muted)",
          }}
        >
          {footer.copyright}
        </p>

        <div
          className="absolute top-1/2 flex -translate-y-1/2 items-center"
          style={{ right: dark ? 143 : 94, gap: dark ? 24 : 22, marginTop: dark ? -2 : 0 }}
        >
          <span
            className="block"
            style={{ width: dark ? 128 : 80, height: 2, background: "var(--accent)", borderRadius: 1 }}
          />
          <span
            className="whitespace-nowrap"
            style={{
              fontSize: dark ? 8.35 : 11,
              fontWeight: 700,
              letterSpacing: dark ? "0.28em" : "0.14em",
              wordSpacing: dark ? 6 : undefined,
              color: "var(--accent)",
            }}
          >
            {footer.tags.join(" • ")}
          </span>
        </div>
      </div>
    </footer>
  );
}
