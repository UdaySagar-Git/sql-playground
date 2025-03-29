"use client";

import { ThemeProvider } from "next-themes";
import { PanelProvider } from "./PanelProvider";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <QueryProvider>
        <PanelProvider>
          {children}
        </PanelProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}; 