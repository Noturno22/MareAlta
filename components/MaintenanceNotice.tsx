"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, TriangleAlert, X } from "lucide-react";
import { contacts } from "@/lib/content";
import { useTheme } from "./theme";

export default function MaintenanceNotice() {
  const [open, setOpen] = useState(true);
  const { theme } = useTheme();
  const dark = theme === "dark";
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  const supportHref = `${contacts.whatsappHref}?text=${encodeURIComponent(
    "Olá! Preciso de informações sobre o site ficar fora do ar."
  )}`;

  return (
    <div
      data-notice
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
      style={{
        background: dark ? "rgba(2, 4, 5, 0.78)" : "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(8px)",
        animation: "notice-fade-in 180ms ease-out",
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <section
        data-notice
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-title"
        aria-describedby="notice-desc"
        className="relative w-full max-w-[460px] overflow-hidden rounded-[22px]"
        style={{
          background: dark ? "#0e1113" : "#ffffff",
          border: `1px solid ${dark ? "rgba(255,255,255,.12)" : "#e8e4e0"}`,
          boxShadow: dark ? "0 24px 70px rgba(0,0,0,.65)" : "0 24px 70px rgba(15,23,42,.22)",
          animation: "notice-pop-in 240ms cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
        />

        <div className="flex items-start justify-between" style={{ padding: "30px 30px 0" }}>
          <span
            className="flex shrink-0 items-center justify-center rounded-[14px]"
            style={{
              width: 52,
              height: 52,
              background: dark ? "rgba(253,100,6,.14)" : "rgba(254,72,7,.1)",
              color: "var(--accent)",
            }}
          >
            <TriangleAlert size={25} strokeWidth={1.9} />
          </span>

          <button
            ref={closeRef}
            type="button"
            aria-label="Fechar aviso"
            title="Fechar"
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center justify-center rounded-full transition-colors"
            style={{
              width: 36,
              height: 36,
              border: `1px solid ${dark ? "rgba(255,255,255,.14)" : "rgba(15,23,42,.12)"}`,
              background: dark ? "rgba(255,255,255,.05)" : "rgba(15,23,42,.03)",
              color: "var(--text-soft)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "20px 30px 30px" }}>
          <p
            className="font-display"
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: "var(--accent)" }}
          >
            AVISO IMPORTANTE
          </p>

          <h2
            id="notice-title"
            className="font-display"
            style={{
              marginTop: 10,
              fontSize: 27,
              lineHeight: "1.16",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            O site ficará fora do ar dentro de 5 dias
          </h2>

          <p
            id="notice-desc"
            style={{
              marginTop: 12,
              fontSize: 14.5,
              lineHeight: "22px",
              color: "var(--text-muted)",
            }}
          >
            O nosso site ficará temporariamente indisponível. Até lá, a nossa equipa de suporte
            está disponível para ajudar com qualquer informação ou dúvida.
          </p>

          <div
            className="flex items-center"
            style={{
              marginTop: 22,
              padding: "14px 18px",
              borderRadius: 14,
              gap: 16,
              background: dark ? "rgba(255,255,255,.04)" : "rgba(254,72,7,.04)",
              border: `1px solid ${dark ? "rgba(255,255,255,.09)" : "rgba(15,23,42,.08)"}`,
            }}
          >
            <span
              className="font-display"
              style={{ fontSize: 34, lineHeight: 1, fontWeight: 800, color: "var(--accent)" }}
            >
              05
            </span>
            <span
              aria-hidden
              style={{
                width: 1,
                height: 32,
                background: dark ? "rgba(255,255,255,.14)" : "rgba(15,23,42,.12)",
              }}
            />
            <span style={{ fontSize: 13, lineHeight: "18px", color: "var(--text-soft)" }}>
              <strong className="font-display block" style={{ fontSize: 14, fontWeight: 700 }}>
                Dias restantes
              </strong>
              Aproveite para nos contactar antes da pausa.
            </span>
          </div>

          <a
            href={supportHref}
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center justify-center rounded-full text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ height: 48, gap: 10, background: "var(--accent)" }}
          >
            <MessageCircle size={17} strokeWidth={2.2} />
            Falar com o suporte
            <ArrowUpRight size={15} />
          </a>

          <p
            className="text-center"
            style={{ marginTop: 14, fontSize: 13, color: "var(--text-muted)" }}
          >
            Prefere outro meio?{" "}
            <Link
              href="/contacto"
              onClick={() => setOpen(false)}
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              Ver todos os contactos
            </Link>{" "}
            ou ligue{" "}
            <a href={contacts.phoneHref} style={{ color: "var(--accent)", fontWeight: 600 }}>
              {contacts.phone}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
