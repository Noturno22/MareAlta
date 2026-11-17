"use client";

import Footer from "./Footer";
import Header from "./Header";
import MaintenanceNotice from "./MaintenanceNotice";
import { ThemeProvider } from "./theme";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MaintenanceNotice />
      <div className="site-canvas">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
