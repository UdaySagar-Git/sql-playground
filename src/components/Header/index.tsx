"use client";

import { Database, History, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { usePanelState } from "@/providers/PanelProvider";
import styles from "./header.module.css";

export const Header = () => {
  const { showLeftPanel, showRightPanel, setShowLeftPanel, setShowRightPanel } = usePanelState();

  const handleLeftPanelToggle = () => {
    setShowLeftPanel(!showLeftPanel);
    if (!showLeftPanel && showRightPanel) {
      setShowRightPanel(false);
    }
  };

  const handleRightPanelToggle = () => {
    setShowRightPanel(!showRightPanel);
    if (!showRightPanel && showLeftPanel) {
      setShowLeftPanel(false);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={`${styles.menuButton} ${styles.mobileOnly}`}
          onClick={handleLeftPanelToggle}
          title="Database Tables"
          aria-label={showLeftPanel ? "Close database tables panel" : "Open database tables panel"}
        >
          {showLeftPanel ? <X size={20} aria-hidden="true" /> : <Database size={20} aria-hidden="true" />}
        </button>
      </div>
      <div className={styles.headerRight}>
        <ThemeToggle />
        <button
          className={`${styles.menuButton} ${styles.mobileOnly}`}
          onClick={handleRightPanelToggle}
          title="Query History"
          aria-label={showRightPanel ? "Close query history panel" : "Open query history panel"}
        >
          {showRightPanel ? <X size={20} aria-hidden="true" /> : <History size={20} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}; 