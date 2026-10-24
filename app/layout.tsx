import type { Metadata } from "next";
import { Urbanist, Inter } from "next/font/google";
import "./globals.css";

const display = Urbanist({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Maré Alta Music — Somos mais que música, somos conexão",
  description:
    "Gravação profissional, produção musical, mixagem e masterização. Transformamos ideias em grandes produções. Benfica, Zona Verde III, Rua 9.",
};

const themeScript = `try{
  var t=new URLSearchParams(location.search).get("theme");
  t=t||localStorage.getItem("theme");
  document.documentElement.dataset.theme=t==="light"?"light":"dark";
  if(new URLSearchParams(location.search).get("qa"))document.documentElement.dataset.qa="1";
}catch(e){document.documentElement.dataset.theme="dark";}
try{
  function setCanvasZoom(){
    var w=document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--canvas-zoom",String(Math.min(1,w/1536)));
  }
  setCanvasZoom();
  addEventListener("resize",setCanvasZoom);
}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-AO"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
