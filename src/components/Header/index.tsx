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
        >
          {showLeftPanel ? <X size={20} /> : <Database size={20} />}
        </button>
      </div>
      <div className={styles.headerRight}>
        <ThemeToggle />
        <button
          className={`${styles.menuButton} ${styles.mobileOnly}`}
          onClick={handleRightPanelToggle}
          title="Query History"
        >
          {showRightPanel ? <X size={20} /> : <History size={20} />}
        </button>
      </div>
    </header>
  );
}; 