"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Send, Sun } from "lucide-react";
import { nav } from "@/lib/content";
import { useTheme } from "./theme";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  const pathname = usePathname();

  return (
    <header
      className="relative z-30"
      style={{
        height: dark ? 80 : 84,
        background: "var(--bg)",
        borderBottom: "1px solid var(--edge)",
      }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1536px]">
        <Link href="/" aria-label="Maré Alta Music — Início">
          <Image
            src={dark ? "/img/logo-n-dark.png" : "/img/logo-n.png"}
            alt="Maré Alta Music"
            width={dark ? 86 : 92}
            height={dark ? 60 : 64}
            priority
            draggable={false}
            className="absolute select-none"
            style={{
              left: dark ? 148 : 134,
              top: 10,
              width: dark ? 86 : 92,
              height: dark ? 60 : 64,
            }}
          />
        </Link>

        <nav
          className="absolute -translate-y-1/2"
          style={{ left: 636, top: "calc(50% + 2.5px)" }}
        >
          <ul className="flex items-center gap-[38px]">
            {nav.map((item, i) => {
              const active = item.href === pathname;
              return (
                <li key={item.label} className="relative" style={i === 1 ? { marginLeft: 3 } : undefined}>
                  <Link
                    href={item.href}
                    className="block text-[12.5px] font-medium whitespace-nowrap"
                    style={{
                      color: active ? "var(--accent)" : "var(--text)",
                      lineHeight: "40px",
                    }}
                  >
                    {item.label}
                    {active && (
                      <span
                        className="absolute left-0 h-[2px]"
                        style={{ bottom: 4, width: dark ? 34 : "100%", background: "var(--accent)" }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className="absolute flex -translate-y-1/2 items-center"
          style={{ right: dark ? 132 : 127, top: "calc(50% + 2px)", gap: 18 }}
        >
          <button
            type="button"
            data-qa-hide
            aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
            title={dark ? "Modo claro" : "Modo escuro"}
            onClick={() => setTheme(dark ? "light" : "dark")}
            className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full transition-colors"
            style={{
              border: "1px solid " + (dark ? "rgba(255,255,255,.25)" : "rgba(15,23,42,.2)"),
              background: dark ? "rgba(255,255,255,.06)" : "rgba(15,23,42,.04)",
              color: "var(--accent)",
            }}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            href="/contacto"
            className="flex items-center gap-[12px] rounded-full text-[11.2px] font-semibold text-white"
            style={{
              height: 42,
              paddingInline: dark ? 24 : 15,
              background: "var(--accent)",
            }}
          >
            <Send size={15} strokeWidth={2.4} />
            Fale Conosco
          </Link>
        </div>
      </div>
    </header>
  );
}
