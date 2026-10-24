import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import PageIntro from "@/components/PageIntro";
import { contacts, socials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contacto — Maré Alta Music",
  description:
    "Fale connosco: telefone, WhatsApp e estúdio em Benguela, Angola. Maré Alta Music — gravação, mixagem e masterização.",
};

const cards = [
  {
    icon: Phone,
    label: "TELEFONE",
    value: contacts.phone,
    href: contacts.phoneHref,
  },
  {
    icon: MessageCircle,
    label: "WHATSAPP",
    value: contacts.whatsapp,
    href: contacts.whatsappHref,
    external: true,
  },
  {
    icon: MapPin,
    label: "ESTÚDIO",
    value: "Benfica, Zona Verde III, Rua 9 — Benguela",
  },
  {
    icon: Clock,
    label: "HORÁRIO",
    value: "Seg – Sáb: 09h00 às 20h00",
  },
];

export default function ContactoPage() {
  return (
    <>
      <PageIntro
        kicker="FALE CONNOSCO"
        title="Vamos criar algo"
        accent="juntos."
        lead="Conta-nos o teu projecto — respondemos normalmente em menos de 24 horas."
      />

      <section style={{ background: "var(--bg-section)" }}>
        <div
          className="mx-auto grid w-full max-w-[1236px] grid-cols-1 gap-10 px-10 lg:grid-cols-[1.1fr_1fr]"
          style={{ paddingTop: 64, paddingBottom: 72 }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((c) => {
              const Icon = c.icon;
              const body = (
                <>
                  <span
                    className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full"
                    style={{ border: "2px solid var(--accent)", color: "var(--accent)" }}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        letterSpacing: "0.13em",
                        color: "var(--accent)",
                      }}
                    >
                      {c.label}
                    </p>
                    <p
                      style={{
                        marginTop: 6,
                        fontSize: 16,
                        lineHeight: "23px",
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {c.value}
                    </p>
                  </div>
                </>
              );

              const style: React.CSSProperties = {
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: 24,
                borderRadius: 14,
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                boxShadow: "var(--shadow-card)",
              };

              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  style={style}
                >
                  {body}
                </a>
              ) : (
                <div key={c.label} style={style}>
                  {body}
                </div>
              );
            })}

            <div
              className="rounded-[14px] p-6 sm:col-span-2"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <p
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.13em",
                  color: "var(--accent)",
                }}
              >
                SIGA-NOS
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-5 py-2 text-[13.5px] font-semibold"
                  style={{
                    border: "1px solid var(--border-card)",
                    color: "var(--text-soft)",
                  }}
                >
                  Facebook
                </a>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-5 py-2 text-[13.5px] font-semibold"
                  style={{
                    border: "1px solid var(--border-card)",
                    color: "var(--text-soft)",
                  }}
                >
                  Instagram
                </a>
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full px-5 py-2 text-[13.5px] font-semibold"
                  style={{
                    border: "1px solid var(--border-card)",
                    color: "var(--text-soft)",
                  }}
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
