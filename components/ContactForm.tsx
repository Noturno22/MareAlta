"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { contacts, socials } from "@/lib/content";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 48,
  padding: "0 16px",
  borderRadius: 10,
  border: "1px solid var(--border-card)",
  background: "var(--bg)",
  color: "var(--text)",
  fontSize: 15,
  outline: "none",
};

export default function ContactForm() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Olá Maré Alta Music! Sou ${name || "..."}.`,
      from ? `O meu contacto: ${from}` : "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`${contacts.whatsappHref}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4 rounded-[14px] p-7"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <p
        className="font-display"
        style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "var(--accent)" }}
      >
        ENVIAR MENSAGEM
      </p>

      <label className="flex flex-col gap-2" style={{ fontSize: 14, color: "var(--text-soft)" }}>
        Nome
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O teu nome"
          style={inputStyle}
        />
      </label>

      <label className="flex flex-col gap-2" style={{ fontSize: 14, color: "var(--text-soft)" }}>
        Email ou telefone
        <input
          required
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Como te contactamos"
          style={inputStyle}
        />
      </label>

      <label className="flex flex-col gap-2" style={{ fontSize: 14, color: "var(--text-soft)" }}>
        Mensagem
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Conta-nos sobre o teu projeto..."
          style={{ ...inputStyle, height: "auto", padding: "12px 16px", resize: "vertical" }}
        />
      </label>

      <button
        type="submit"
        className="mt-1 flex items-center justify-center gap-[10px] rounded-full text-[13.5px] font-semibold text-white"
        style={{ height: 48, background: "var(--accent)" }}
      >
        <Send size={15} strokeWidth={2.4} />
        Enviar por WhatsApp
      </button>

      <p style={{ fontSize: 13, lineHeight: "19px", color: "var(--text-muted)" }}>
        Também podes escrever para{" "}
        <a href={socials.instagram} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
          as nossas redes
        </a>{" "}
        ou ligar directamente:{" "}
        <a href={contacts.phoneHref} style={{ color: "var(--accent)", fontWeight: 600 }}>
          {contacts.phone}
        </a>
      </p>
    </form>
  );
}
