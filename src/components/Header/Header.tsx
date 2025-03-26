import { Database, History, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import styles from "./header.module.css";

interface HeaderProps {
  showLeftPanel: boolean;
  showRightPanel: boolean;
  onLeftPanelToggle: () => void;
  onRightPanelToggle: () => void;
}

export const Header = ({
  showLeftPanel,
  showRightPanel,
  onLeftPanelToggle,
  onRightPanelToggle,
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuButton}
          onClick={onLeftPanelToggle}
          title="Tables & Saved Queries"
        >
          {showLeftPanel ? <X size={20} /> : <Database size={20} />}
        </button>
      </div>
      <div className={styles.headerRight}>
        <ThemeToggle />
        <button
          className={styles.menuButton}
          onClick={onRightPanelToggle}
          title="Query History"
        >
          {showRightPanel ? <X size={20} /> : <History size={20} />}
        </button>
      </div>
    </header>
  );
}; 