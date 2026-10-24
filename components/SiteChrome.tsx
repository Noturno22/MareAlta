"use client";

import Footer from "./Footer";
import Header from "./Header";
import { ThemeProvider } from "./theme";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="site-canvas">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
