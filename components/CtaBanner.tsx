"use client";

import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { contacts, socials } from "@/lib/content";
import { useTheme } from "./theme";

function InstagramIcon({ size = 21 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="var(--accent)" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--accent)" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.03 1.02-1.03 2.48s1.06 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42" />
    </svg>
  );
}

function FacebookIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="12" fill="var(--accent)" />
      <path
        d="M13.3 19.2v-6.7h2.24l.34-2.6H13.3V8.2c0-.75.21-1.26 1.29-1.26h1.37V4.6c-.24-.03-1.05-.1-2-.1-1.97 0-3.32 1.2-3.32 3.41v1.99H8.32v2.6h2.32v6.7h2.66Z"
        fill="#fff"
      />
    </svg>
  );
}

function YoutubeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <rect x="0" y="3.2" width="24" height="17.6" rx="5" fill="var(--accent)" />
      <path d="M9.9 8.4 16.2 12l-6.3 3.6V8.4Z" fill="#fff" />
    </svg>
  );
}

export default function CtaBanner() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden"
      style={{
        height: dark ? 190 : 197,
        background: dark ? "#050608" : "#ffffff",
        borderTop: dark ? "none" : "1px solid #d7d4d2",
      }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1536px]">
        <Image
          src={dark ? "/img/cta-dark-left.png" : "/img/cta-light-left.png"}
          alt=""
          width={dark ? 620 : 470}
          height={dark ? 160 : 166}
          draggable={false}
          className="absolute left-0 top-0 select-none"
          style={{ width: dark ? 620 : 470, height: dark ? 160 : 166 }}
        />
        <Image
          src="/img/cta-dark.png"
          alt=""
          width={360}
          height={160}
          draggable={false}
          className="absolute select-none"
          style={{ left: 620, top: 0, width: 360, height: 160, display: dark ? "block" : "none" }}
        />
        <Image
          src="/img/cta-light.png"
          alt=""
          width={492}
          height={166}
          draggable={false}
          className="absolute select-none"
          style={{ left: 470, top: 0, width: 492, height: 166, display: dark ? "none" : "block" }}
        />
        <Image
          src={dark ? "/img/cta-dark-right.png" : "/img/cta-light-right.png"}
          alt=""
          width={dark ? 556 : 574}
          height={dark ? 160 : 166}
          draggable={false}
          className="absolute select-none"
          style={{
            left: dark ? 980 : 962,
            top: 0,
            width: dark ? 556 : 574,
            height: dark ? 160 : 166,
          }}
        />

        <h2 className="sr-only">Juntos criamos grandes histórias.</h2>

        <div
          id="contactos"
          className="absolute"
          style={{ left: dark ? 1024 : 1045, top: dark ? 40 : 33 }}
        >
          <p
            style={{
              fontSize: dark ? 10 : 11,
              lineHeight: "13px",
              fontWeight: 700,
              letterSpacing: dark ? "0" : "0.12em",
              color: "var(--accent)",
            }}
          >
            {contacts.label}
          </p>
          <a
            href={contacts.phoneHref}
            className="font-display block"
            style={{
              marginTop: dark ? 6 : 7,
              fontSize: dark ? 21 : 30,
              lineHeight: dark ? "26px" : "34px",
              fontWeight: 700,
              letterSpacing: dark ? "0.085em" : "normal",
              color: "var(--text)",
            }}
          >
            {contacts.phone}
          </a>
          <a
            href={contacts.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center"
            style={{
              marginTop: dark ? 4 : 8,
              gap: 8,
              fontSize: dark ? 18 : 16.5,
              lineHeight: dark ? "22px" : "20px",
              fontWeight: 600,
              letterSpacing: dark ? "-0.05em" : "normal",
              color: "var(--text)",
            }}
          >
            <WhatsAppIcon size={dark ? 19 : 16} />
            {contacts.whatsapp}
          </a>
        </div>

        <span
          className="absolute"
          style={{
            left: dark ? 1217 : 1265,
            top: dark ? 39 : 27,
            width: dark ? 2 : 1,
            height: dark ? 77 : 115,
            background: dark ? "rgba(255,255,255,.36)" : "rgba(15,23,42,.13)",
          }}
        />

        <div
          className="absolute"
          style={{ left: dark ? 1262 : 1285, top: dark ? 40 : 33 }}
        >
          <p
            style={{
              fontSize: dark ? 10 : 11,
              lineHeight: "13px",
              fontWeight: 700,
              letterSpacing: dark ? "0" : "0.12em",
              color: "var(--accent)",
            }}
          >
            {contacts.follow}
          </p>
          <div className="flex items-center" style={{ marginTop: dark ? 11 : 14, gap: dark ? 18 : 13 }}>
            <a href={socials.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
              <InstagramIcon size={dark ? 23 : 21} />
            </a>
            <a href={socials.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
              <FacebookIcon size={dark ? 23 : 21} />
            </a>
            <a href={socials.youtube} aria-label="YouTube" target="_blank" rel="noreferrer">
              <YoutubeIcon size={dark ? 23 : 21} />
            </a>
          </div>
          <p
            className="flex items-center whitespace-nowrap"
            style={{
              marginTop: dark ? 16 : 22,
              gap: dark ? 10 : 6,
              fontSize: dark ? 10.5 : 13.5,
              lineHeight: dark ? "14px" : "16px",
              fontWeight: 500,
              color: dark ? "#f1f5f8" : "var(--text)",
            }}
          >
            {dark ? (
              <svg
                width={13}
                height={18}
                viewBox="5 2 14 19"
                fill="var(--accent)"
                aria-hidden
                className="shrink-0"
                style={{ marginLeft: 2 }}
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9.5" r="3" fill="#050608" />
              </svg>
            ) : (
              <MapPin size={15} strokeWidth={2.2} style={{ color: "var(--accent)" }} className="shrink-0" />
            )}
            {contacts.address}
          </p>
        </div>

        <a
          href={contacts.phoneHref}
          aria-label="Ligar"
          className="absolute flex items-center justify-center rounded-full"
          style={{
            left: dark ? 967 : 990,
            top: dark ? 39 : 27,
            width: dark ? 40 : 46,
            height: dark ? 40 : 46,
            background: "var(--accent)",
          }}
        >
          <Phone size={dark ? 17 : 20} color="#fff" fill="#fff" strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
}
