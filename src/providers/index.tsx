"use client";

import { ThemeProvider } from "next-themes";
import { PanelProvider } from "./PanelProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <PanelProvider>
        {children}
      </PanelProvider>
    </ThemeProvider>
  );
}; 