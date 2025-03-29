"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PanelContextType {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  setShowLeftPanel: (show: boolean) => void;
  setShowRightPanel: (show: boolean) => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  return (
    <PanelContext.Provider
      value={{
        showLeftPanel,
        showRightPanel,
        setShowLeftPanel,
        setShowRightPanel,
      }}
    >
      {children}
    </PanelContext.Provider>
  );
}

export function usePanelState() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error("usePanelState must be used within a PanelProvider");
  }
  return context;
} 